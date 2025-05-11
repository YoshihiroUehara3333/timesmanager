// モジュール読み込み
require('date-utils');
const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { subtype } = require('@slack/bolt');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { AppMentionController } = require('./controller/AppMentionController');
const { DiaryService } = require('./service/DiaryService');
const { OpenAIFeedbackGenerator } = require('./service/OpenAIFeedbackGenerator');
const { SlackPresenter } = require('./presenter/SlackPresenter');

// DI
const diaryRepository = new DynamoDiaryRepository();
const feedbackGenerator = new OpenAIFeedbackGenerator();
const diaryService = new DiaryService(diaryRepository, feedbackGenerator);
const presenter = new SlackPresenter();
const appMentionController = new AppMentionController(diaryService, presenter);

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
app.event('app_mention', async ({ event, context, logger, client }) => {
    logger.info('context出力' + JSON.stringify(context));
    await appMentionController.handleAppMention(event, context, logger, client);
});

// 日記呼び出し
app.message(/日記呼び出し[:：](\d{4}-\d{2}-\d{2})/, async ({ message, context, say }) => {
});