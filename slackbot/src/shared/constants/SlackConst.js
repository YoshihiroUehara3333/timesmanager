// src/shared/constants/SlackConst.js

exports.SlackConst = {
  ID: {
    botUserId: process.env.SLACK_BOT_USER_ID,
  },
  APPCOMMANDS: {
    MAKETHREAD: '/makethread',
    NEWTASK: '/newtask',
    WARMUP: '/warmup',
  },
}
