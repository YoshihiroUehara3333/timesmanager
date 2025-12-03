// src/app.js
const { App, LogLevel } = require('@slack/bolt')
const { SlackApiAdaptor } = require('./core/slack/SlackApiAdaptor')
const { BackendHttpClient } = require('./core/backend/BackendHttpClient')

// featureごとの登録関数
const { registerMakeThreadFeature } = require('./features/makethread')
const { registerHomeFeature } = require('./features/home')
const { registerAttendanceFeature } = require('./features/attendance')
// const { registerTaskFeature } = require('./features/task')
// const { registerDailyReportFeature } = require('./features/daily-report')

/**
 * Bolt App を組み立てて返すファクトリ関数
 * - ローカル起動でも Lambda でも共通で使えるようにしておく
 */
function createBoltApp() {
  const app = new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    logLevel: LogLevel.INFO,
  })

  // 共通インフラ
  const slackApiAdaptor = new SlackApiAdaptor(app.client)

  const backendHttpClient = new BackendHttpClient({
    baseUrl: process.env.BACKEND_BASE_URL,
    timeoutMs: 5000,
  })

  // --- featureごとの登録 ---
  registerMakeThreadFeature({ app, slackApiAdaptor, backendHttpClient })
  registerHomeFeature({ app, slackApiAdaptor, backendHttpClient })
  registerAttendanceFeature({ app, slackApiAdaptor, backendHttpClient })
  // registerTaskFeature({ app, slackApiAdaptor, backendHttpClient })
  // registerDailyReportFeature({ app, slackApiAdaptor, backendHttpClient })

  return app
}

// ローカル開発用: `node src/app.js` で動かせるようにしておく
if (require.main === module) {
  ;(async () => {
    const app = createBoltApp()
    const port = process.env.PORT || 3000

    await app.start(port)
    console.log(`⚡️ Slack Bolt app is running on port ${port}`)
  })().catch((err) => {
    console.error('Failed to start Bolt app', err)
    process.exit(1)
  })
}

// Lambda 用などから require される前提
module.exports = { createBoltApp }