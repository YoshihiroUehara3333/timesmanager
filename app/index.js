// モジュール読み込み
const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { DynamoDiaryRepository } = require('./repository/DynamoDiaryRepository');
const { DynamoTwitterRepository } = require('./repository/DynamoTwitterRepository');
const { AppCommandController } = require('./controller/AppCommandController');
const { AppMessageController } = require('./controller/AppMessageController');
const { AppViewController } = require('./controller/AppViewController');
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
const appViewController = new AppViewController();

const parseBody = async (req) => {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const bodyString = Buffer.concat(chunks).toString();
    try {
        return JSON.parse(bodyString);
    } catch {
        return null;
    }
};

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    processBeforeResponse: true,
});
const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    receiver: awsLambdaReceiver,
    customRoutes: [
        {
            path: '/slack/events', // Slackが送ってくるURLと一致させる
            method: ['POST'],
            handler: async (req, res) => {
                const body = await parseBody(req);
                if (body && body.challenge) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(body.challenge);
                } else {
                res.writeHead(404);
                res.end();
                }
            }
        }
    ]
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

app.view('makethread_modal', async ({ body, view, client }) => {
    console.log(`
        app.view \n
        body: ${JSON.stringify(body)} \n
        view: ${JSON.stringify(view)} \n
    `);

    const userId = body.user.id;
    const metadata = JSON.parse(view.private_metadata);
    const { channel_id, thread_ts, date } = metadata;

    const title = view.state.values.title_block.title_input.value;
    const content = view.state.values.content_block.content_input.value;

    // スレッドへの返信
    await client.chat.postMessage({
        channel: channel_id,
        thread_ts: thread_ts,
        text: `📝 <@${userId}> さんの作業予定\n*タイトル:* ${title}\n*内容:* ${content}`
    });

    // 必要であればDBに保存（例: DynamoDB）
    // await dynamo.put({ ... });
});

// ハンドラー生成
exports.handler = async (event, context, callback) => {    
    return await handler(event, context, callback);
};