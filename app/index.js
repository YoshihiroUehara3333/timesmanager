// モジュール読み込み
const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { ModalConst } = require('./constants/ModalConst');
const { createDIContainer } = require('./container');

// DIコンテナの初期化
const container = createDIContainer();

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    processBeforeResponse: true,
})

const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver: awsLambdaReceiver,
})

const handler = awsLambdaReceiver.toHandler();

// スラッシュコマンド検知
app.command(/.*/, async ({ ack, command, context, logger, client }) => {
    logger.info(`app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n`);

    if (context.retryNum) {
        await ack();
        return; // リトライ以降のリクエストは弾く
    };

    await ack();
    await container.resolve('appCommandController').dispatchAppCommand(command, logger, client);
})

// メッセージ検知
app.message(async ({ message, context, logger, client }) => {
    logger.info(`app.message\ncontext:${JSON.stringify(context)}\nmessage:${JSON.stringify(message)}\n`);

    if (context.retryNum) {
        return; // リトライ以降のリクエストは弾く
    };

    await container.resolve('appMessageController').handleAppMessage(message, logger, client);
})

// モーダル押下時
app.view(ModalConst.CALLBACK_ID.MAKETHREAD, async ({ ack, body, view, logger, client }) => {
    logger.info(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`);

    await ack();
    await container.resolve('appViewController').handleModalCallback(body, view, logger, client);
})

// 途中経過記録ボタン
app.action(ModalConst.ACTION_ID.WORKREPORT.PROGRESS, async ({ ack, body, logger }) => {
    logger.info(`app.action\nbody:${JSON.stringify(body)}`);

    await ack();
    await container.resolve('appActionController').handleWorkReportAction();
})

// 作業完了ボタン
app.action(ModalConst.ACTION_ID.WORKREPORT.FINISH, async ({ ack, body, logger }) => {
    logger.info(`app.action\nbody:${JSON.stringify(body)}`);

    await ack();
    await container.resolve('appActionController').handleWorkReportAction();
})

// ハンドラー生成
exports.handler = async (event, context, callback) => {
    return await handler(event, context, callback);
};