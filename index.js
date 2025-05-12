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
const appMessageController = new AppMessageController();

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver: awsLambdaReceiver,
});

// メンション検知
app.event('app_mention', async ({ ack, event, context, logger, client }) => {
    await ack();
    console.log('app_mention');
    await appMentionController.handleAppMention(event, context, logger, client);
});

// スラッシュコマンド検知
app.command(/.*/, async ({ ack, command, context, logger, client }) => {
    await ack();
    console.log('app.command');
    await appCommandController.handleAppCommand(command, context, logger, client);
});

// メッセージ検知
app.message(async ({ message, context, logger, client }) => {
    console.log('app.message');
    await appMessageController.handleAppMessage(message, context, logger, client);
});

// ハンドラー生成
const handler = awsLambdaReceiver.toHandler();
exports.handler = async (event, context, callback) => {    
    return await handler(event, context, callback);
};