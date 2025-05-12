// モジュール読み込み
require('date-utils');
const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { subtype } = require('@slack/bolt');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { AppMentionController } = require('./controller/AppMentionController');
const { AppCommandController } = require('./controller/AppCommandController');
const { DiaryService } = require('./service/DiaryService');
const { OpenAIFeedbackGenerator } = require('./service/OpenAIFeedbackGenerator');
const { SlackService } = require('./service/SlackService');
const { SlackPresenter } = require('./presenter/SlackPresenter');

// DI
const diaryRepository = new DynamoDiaryRepository();
const feedbackGenerator = new OpenAIFeedbackGenerator();
const diaryService = new DiaryService(diaryRepository, feedbackGenerator);
const slackService = new SlackService();
const presenter = new SlackPresenter();
const appMentionController = new AppMentionController(diaryService, slackService, presenter);
const appCommandController = new AppCommandController();

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});
const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver: awsLambdaReceiver,
});

exports.handler = async (event, context, callback) => {
    const handler = awsLambdaReceiver.toHandler();
    return await handler(event, context, callback);
}

// メンション検知
app.event('app_mention', async ({ ack, event, context, logger, client }) => {
    await ack();
    logger.info('context出力' + JSON.stringify(context));
    await appMentionController.handleAppMention(event, context, logger, client);
});

// /makethread検知
app.command('/makethread', async ({ ack, event, context, logger, client }) => {
    await ack();
    logger.info('context出力' + JSON.stringify(context));
    await appCommandController.handleAppCommand(event, context, logger, client);
});