// モジュール読み込み
const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { DynamoTwitterRepository } = require('./repository/DynamoTwitterRepository');
const { AppCommandController } = require('./controller/AppCommandController');
const { AppMessageController } = require('./controller/AppMessageController');
const { DiaryService } = require('./service/DiaryService');
const { TwitterService } = require('./service/TwitterService');
const { OpenAIFeedbackGenerator } = require('./service/OpenAIFeedbackGenerator');
const { SlackService } = require('./service/SlackService');
const { SlackPresenter } = require('./presenter/SlackPresenter');

// DI
const diaryRepository = new DynamoDiaryRepository();
const twitterRepository = new DynamoTwitterRepository();

const feedbackGenerator = new OpenAIFeedbackGenerator();
const diaryService = new DiaryService(diaryRepository, feedbackGenerator);
const slackService = new SlackService();
const twitterService = new TwitterService(twitterRepository);

const slackPresenter = new SlackPresenter();
const appCommandController = new AppCommandController(slackPresenter);
const appMessageController = new AppMessageController(diaryService, twitterService, slackPresenter);


// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver: awsLambdaReceiver,
});

const handler = awsLambdaReceiver.toHandler();

// スラッシュコマンド検知
app.command(/.*/, async ({ command, context, logger, client }) => {
    if(context.retryNum) return; // リトライ以降のリクエストは弾く
    console.log(`
    app.command \n
    context: ${JSON.stringify(context)} \n
    command: ${JSON.stringify(command)} \n
    `);
    await appCommandController.handleAppCommand(command, logger, client);
});

// メッセージ検知
app.message(async ({ message, context, logger, client }) => {
    if(context.retryNum) return; // リトライ以降のリクエストは弾く
    console.log(`
    app.message \n
    context: ${JSON.stringify(context)} \n
    message: ${JSON.stringify(message)} \n
    `);
    await appMessageController.handleAppMessage(message, logger, client);
});

// ハンドラー生成
exports.handler = async (event, context, callback) => {    
    return await handler(event, context, callback);
};