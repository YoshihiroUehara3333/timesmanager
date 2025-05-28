// モジュール読み込み
const { App, AwsLambdaReceiver }    = require('@slack/bolt');
const { DynamoDiaryRepository }     = require('./repository/DynamoDiaryRepository');
const { DynamoThreadRepository }    = require('./repository/DynamoThreadRepository');
const { AppCommandController }      = require('./controller/AppCommandController');
const { AppMessageController }      = require('./controller/AppMessageController');
const { AppViewController }         = require('./controller/AppViewController');
const { AppActionController }       = require('./controller/AppActionController');
const { DiaryService }              = require('./service/DiaryService');
const { ThreadService }             = require('./service/ThreadService');
const { OpenAIFeedbackGenerator }   = require('./service/OpenAIFeedbackGenerator');
const { SlackPresenter }            = require('./presenter/SlackPresenter');
const { ModalConst }                = require('./constants/ModalConst');

// DI
const diaryRepository       = new DynamoDiaryRepository();
const threadRepository      = new DynamoThreadRepository();

const feedbackGenerator     = new OpenAIFeedbackGenerator();
const diaryService          = new DiaryService(diaryRepository, feedbackGenerator);
const threadService         = new ThreadService(threadRepository);

const slackPresenter        = new SlackPresenter();
const appCommandController  = new AppCommandController(threadService);
const appMessageController  = new AppMessageController(diaryService, threadService, slackPresenter);
const appViewController     = new AppViewController(threadService, slackPresenter);
const appActionController   = new AppActionController();


// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret           : process.env.SLACK_SIGNING_SECRET,
    processBeforeResponse   : true,
})
const app = new App({
    token    : process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver : awsLambdaReceiver,
})

const handler = awsLambdaReceiver.toHandler();

// スラッシュコマンド検知
app.command(/.*/, async ({ ack, command, context, logger, client }) => {
    logger.info(`
    app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n
    `.trim());

    if(context.retryNum) {
        await ack();
        return; // リトライ以降のリクエストは弾く
    };
    
    await ack();
    await appCommandController.handleAppCommand(command, logger, client);
})

// メッセージ検知
app.message(async ({ message, context, logger, client }) => {
    logger.info(`
    app.message\ncontext:${JSON.stringify(context)}\nmessage:${JSON.stringify(message)}\n`
    .trim());

    if(context.retryNum) {
        await ack();
        return; // リトライ以降のリクエストは弾く
    };

    await appMessageController.handleAppMessage(message, logger, client);
})

// モーダル押下時
app.view(ModalConst.CALLBACK_ID.MAKETHREAD, async ({ ack, body, view, logger, client }) => {
    logger.info(`app.view \n body:${JSON.stringify(body)}\nview:${JSON.stringify(view)}\n`
    .trim());

    await ack();
    await appViewController.handleModalCallback(body, view, logger, client);
})

// 途中経過記録ボタン
app.action(ModalConst.ACTION_ID.WORKREPORT.PROGRESS, async ({ack, body, logger}) => {
    logger.info(`app.action\nbody:${JSON.stringify(body)}\n`.trim());

    await ack();
    await appActionController.handleWorkPlanAction();
})

// 作業完了ボタン
app.action(ModalConst.ACTION_ID.WORKREPORT.FINISH, async ({ack, body, logger}) => {
    logger.info(`app.action \n body:${JSON.stringify(body)}\n`.trim());

    await ack();
    await appActionController.handleWorkPlanAction();
})

// ハンドラー生成
exports.handler = async (event, context, callback) => {    
    return await handler(event, context, callback);
};