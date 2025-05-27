// ローカル開発用の Bolt アプリ起動スクリプト
require('dotenv').config();
const { App } = require('@slack/bolt');

const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { AppCommandController } = require('./controller/AppCommandController');
// 必要に応じて他も import

const slackPresenter = {}; // Presenterモック or 実装
const diaryRepo = new DynamoDiaryRepository();
const appCommandController = new AppCommandController(slackPresenter);

// Bolt app 初期化
const app = new App({
  token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  port: 3000
});

// スラッシュコマンドなどの登録
app.command('/makethread', async ({ command, ack, client, logger }) => {
  await ack();
  await appCommandController.handleAppCommand(command, logger, client);
});

// 起動
(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running on http://localhost:3000');
})();