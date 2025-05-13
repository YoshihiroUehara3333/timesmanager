// モジュール読み込み
const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { AppMentionController } = require('./controller/AppMentionController');
const { AppCommandController } = require('./controller/AppCommandController');
const { AppMessageController } = require('./controller/AppMessageController');
const { DiaryService } = require('./service/DiaryService');
const { OpenAIFeedbackGenerator } = require('./service/OpenAIFeedbackGenerator');
const { SlackService } = require('./service/SlackService');
const { SlackPresenter } = require('./presenter/SlackPresenter');

// DI
const diaryRepository = new DynamoDiaryRepository();
const feedbackGenerator = new OpenAIFeedbackGenerator();
const diaryService = new DiaryService(diaryRepository, feedbackGenerator);
const slackService = new SlackService();
const slackPresenter = new SlackPresenter();
const appMentionController = new AppMentionController(diaryService, slackService, slackPresenter);
const appCommandController = new AppCommandController(slackPresenter);
const appMessageController = new AppMessageController(diaryService, slackPresenter);

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver: awsLambdaReceiver,
});

const handler = awsLambdaReceiver.toHandler();

// メンション検知
app.event('app_mention', async ({ event, context, logger, client }) => {
    if(context.retryNum) return; // リトライ以降のリクエストは弾く
    console.log(`
        app_mention
        context: ${JSON.stringify(context)}
        event: ${JSON.stringify(event)}
    `);
    await appMentionController.handleAppMention(event, logger, client);
});

// スラッシュコマンド検知
app.command(/.*/, async ({ command, context, logger, client }) => {
    if(context.retryNum) return; // リトライ以降のリクエストは弾く
    console.log(`
        app.command
        context: ${JSON.stringify(context)}
        command: ${JSON.stringify(command)}
    `);
    await appCommandController.handleAppCommand(command, logger, client);
});

// メッセージ検知
app.message(async ({ message, context, logger, client }) => {
    if(context.retryNum) return; // リトライ以降のリクエストは弾く
    console.log(`
        app.message
        context: ${JSON.stringify(context)}
        message: ${JSON.stringify(message)}
    `);
    await appMessageController.handleAppMessage(message, logger, client);
});

// ハンドラー生成
exports.handler = async (event, context, callback) => {    
    return await handler(event, context, callback);
};