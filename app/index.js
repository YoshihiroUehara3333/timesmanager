// モジュール読み込み
const { App, AwsLambdaReceiver }     = require('@slack/bolt');
const { DynamoPostDataRepository }   = require('./repository/DynamoPostDataRepository');
const { AppCommandController }       = require('./controller/AppCommandController');
const { AppMessageController }       = require('./controller/AppMessageController');
const { AppViewController }          = require('./controller/AppViewController');
const { AppActionController }        = require('./controller/AppActionController');
const { DiaryService }               = require('./service/DiaryService');
const { ThreadService }              = require('./service/ThreadService');
const { WorkReportService }          = require('./service/WorkReportService');
const { OpenAiApiAdaptor }           = require('./adaptor/openai/OpenAiApiAdaptor');
const { SlackApiAdaptor }            = require('./adaptor/slack/SlackApiAdaptor');
const { ModalConst }                 = require('./constants/ModalConst');

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret          : process.env.SLACK_SIGNING_SECRET,
    processBeforeResponse  : true,
})
const app = new App({
    token    : process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver : awsLambdaReceiver,
})

const handler = awsLambdaReceiver.toHandler();

// DI
const postDataRepository    = new DynamoPostDataRepository();

const openAiApiAdaptor      = new OpenAiApiAdaptor();
const slackApiAdaptor       = new SlackApiAdaptor(app.client);

const diaryService          = new DiaryService(postDataRepository, openAiApiAdaptor, slackApiAdaptor);
const threadService         = new ThreadService(postDataRepository, slackApiAdaptor);
const workReportService     = new WorkReportService(postDataRepository);

const appCommandController  = new AppCommandController(threadService, workReportService, slackApiAdaptor);
const appMessageController  = new AppMessageController(diaryService, threadService, slackApiAdaptor);
const appViewController     = new AppViewController(threadService, workReportService, slackApiAdaptor);
const appActionController   = new AppActionController(workReportService);




// スラッシュコマンド検知
app.command(/.*/, async ({ ack, command, context, logger}) => {
    logger.info(`app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n`);

    if(context.retryNum) {
        await ack();
        return; // リトライ以降のリクエストは弾く
    };
    
    await ack();
    await appCommandController.dispatchAppCommand(command, logger);
})

// メッセージ検知
app.message(async ({ message, context, logger}) => {
    logger.info(`app.message\ncontext:${JSON.stringify(context)}\nmessage:${JSON.stringify(message)}\n`);

    if(context.retryNum) {
        return; // リトライ以降のリクエストは弾く
    };

    await appMessageController.handleAppMessage(message, logger);
})

// モーダルの「送信」押下時
app.view({ type: 'view_submission' }, async ({ ack, body, view, logger}) => {
    logger.info(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`);

    await ack();
    await appViewController.dispatchModalCallback(body, view, logger);
})

// 途中経過記録ボタン
app.action(ModalConst.ACTION_ID.WORKREPORT.PROGRESS, async ({ack, body, logger}) => {
    logger.info(`app.action\nbody:${JSON.stringify(body)}`);

    await ack();
    await appActionController.dispatchModalCallback();
})

// 作業完了ボタン
app.action(ModalConst.ACTION_ID.WORKREPORT.FINISH, async ({ack, body, logger}) => {
    logger.info(`app.action\nbody:${JSON.stringify(body)}`);

    await ack();
    await appActionController.handleWorkReportAction();
})

// ハンドラー生成
exports.handler = async (event, context, callback) => {    
    return await handler(event, context, callback);
};