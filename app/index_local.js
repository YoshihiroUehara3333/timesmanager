// ローカル開発用の Bolt アプリ起動スクリプト
require('dotenv').config();
// モジュール読み込み
const { App } = require('@slack/bolt');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { DynamoThreadRepository } = require('./repository/DynamoThreadRepository');
const { AppCommandController } = require('./controller/AppCommandController');
const { AppMessageController } = require('./controller/AppMessageController');
const { AppViewController } = require('./controller/AppViewController');
const { DiaryService } = require('./service/DiaryService');
const { ThreadService } = require('./service/ThreadService');
const { OpenAIFeedbackGenerator } = require('./service/OpenAIFeedbackGenerator');
const { SlackPresenter } = require('./presenter/SlackPresenter');
const { ModalConst } = require('./constants/ModalConst');

// DI
const diaryRepository = new DynamoDiaryRepository();
const threadRepository = new DynamoThreadRepository();

const feedbackGenerator = new OpenAIFeedbackGenerator();
const diaryService = new DiaryService(diaryRepository, feedbackGenerator);
const threadService = new ThreadService(threadRepository);

const slackPresenter = new SlackPresenter();
const appCommandController = new AppCommandController(slackPresenter);
const appMessageController = new AppMessageController(diaryService, threadService, slackPresenter);
const appViewController = new AppViewController();

// Bolt app 初期化
const app = new App({
  token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  port: 3000
});

// スラッシュコマンド検知
app.command(/.*/, async ({ ack, command, context, logger, client }) => {
    if(context.retryNum) {
        await ack();
        return; // リトライ以降のリクエストは弾く
    }

    console.log(`
    app.command \n
    context: ${JSON.stringify(context)} \n
    command: ${JSON.stringify(command)} \n
    `);
    
    await ack();
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

// モーダル押下時
app.view(ModalConst.CALLBACK_ID.MAKETHREAD, async ({ ack, body, view, client }) => {
    await ack();
    console.log(`
    app.view \n
    body: ${JSON.stringify(body)} \n
    view: ${JSON.stringify(view)} \n
    `);
    await appViewController.handleModalCallback(body, view, client);
});

// 起動
(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running on http://localhost:3000');
})();