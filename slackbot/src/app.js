// src/app.js
const { App, LogLevel } = require('@slack/bolt')
const { SlackApiAdaptor } = require('./core/slack/SlackApiAdaptor')
const { BackendHttpClient } = require('./core/backend/BackendHttpClient')

const { registerThreadFeature } = require('./features/thread')
const { registerHomeFeature } = require('./features/home')
const { registerAttendanceFeature } = require('./features/attendance')
const { registerTaskFeature } = require('./features/task')
const { registerWarmUpFeature } = require('./features/warmup')
const { registerDailyReportFeature } = require('./features/dailyreport')

/**
 * Bolt App を組み立てて返すファクトリ関数
 * - ローカル起動でも Lambda でも共通で使えるようにしておく
 */
function createBoltApp ({ receiver }) {
  return new App({
    token: process.env.SLACK_BOT_USER_ACCESS_TOKEN,
    logLevel: LogLevel.INFO,
    receiver
  })
}

function setUpContainer ({ app }) {
  return {
    app: app,
    slackApiAdaptor: new SlackApiAdaptor(app.client),
    backendHttpClient: new BackendHttpClient({
      baseUrl: process.env.BACKEND_API_BASE_URL,
      timeoutMs: 5000,
    })
  }
}

function registerFeatures ({ container }) {
  // --- featureごとの登録 ---
  registerThreadFeature({ ...container })
  registerHomeFeature({ ...container })
  registerAttendanceFeature({ ...container })
  registerTaskFeature({ ...container })
  registerWarmUpFeature({ ...container })
  registerDailyReportFeature({ ...container })
}

// Lambda 用などから require される前提
module.exports = {
  createBoltApp,
  setUpContainer,
  registerFeatures
}
