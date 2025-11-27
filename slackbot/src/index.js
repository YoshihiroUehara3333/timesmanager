// モジュール読み込み
const { App, AwsLambdaReceiver } = require('@slack/bolt')
const { getDiContext } = require('./di/getDiContext')
const { AppCommandHandler } = require('./handler/AppCommandHandler')
const { AppMessageHandler } = require('./handler/AppMessageHandler')
const { AppViewHandler } = require('./handler/AppViewHandler')
const { AppActionHandler } = require('./handler/AppActionHandler')
const { AppEventHandler } = require('./handler/AppEventHandler')

// アプリ初期化
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
})
const app = new App({
  token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
  receiver: awsLambdaReceiver,
})
const handler = awsLambdaReceiver.toHandler()

// DI
const diContext = getDiContext(app.client)
const appCommandHandler = new AppCommandHandler(diContext.handler)
const appMessageHandler = new AppMessageHandler(diContext.handler)
const appViewHandler = new AppViewHandler(diContext.handler)
const appActionHandler = new AppActionHandler(diContext.handler)
const appEventHandler = new AppEventHandler(diContext.handler)

// スラッシュコマンド検知
app.command(/.*/, async ({ ack, command, context, logger }) => {
  ack()
  if (context.retryNum) return
  logger.info(`app.command\ncontext:${JSON.stringify(context)}\nbody:${JSON.stringify(body)}\n`)
  await appCommandHandler.handle(command, logger)
})

// メッセージ検知
app.message(async ({ ack, message, context, logger }) => {
  ack()
  if (context.retryNum) return // リトライ以降のリクエストは弾く
  logger.info(`app.message\ncontext:${JSON.stringify(context)}\nmessage:${JSON.stringify(message)}\n`)
  await appMessageHandler.handle(message, logger)
})

// モーダルの「送信」押下時
app.view({ type: 'view_submission' }, async ({ ack, body, view, logger }) => {
  ack()
  logger.info(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`)
  await appViewHandler.handle(body, logger)
})

// action受信
app.action({ type: 'block_actions' }, async ({ ack, body, logger }) => {
  ack()
  logger.info(`app.action\nbody:${JSON.stringify(body)}`)
  await appActionHandler.handle(body, logger)
})

// homeタブを開いたとき
app.event({ type: 'app_home_opened' }, async ({ body, event, logger }) => {
  logger.info(`app.event\nevent:${JSON.stringify(event)}/nbody:${JSON.stringify(body)}\n`)
  await appEventHandler.handle(body, event, logger)
})

// ハンドラー生成
exports.handler = async (event, context, callback) => {
  return await handler(event, context, callback)
}
