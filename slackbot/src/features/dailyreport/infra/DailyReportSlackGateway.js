// src/features/dailyreport/infra/DailyReportSlackGateway.js

const { SlackGatewayBase } = require('../../../core/slack/SlackGatewayBase')

class DailyReportSlackGateway extends SlackGatewayBase {
  /**
   * メッセージを送信する
   */
  async postMessage ({ channelId, text }) {
    const message = await this.slackApiAdaptor.postMessage({
      channel: channelId,
      text,
    })

    return message
  }

  async openModal ({ triggerId, view }) {
    await this.slackApiAdaptor.viewsOpen({
      triggerId,
      view,
    })
  }
}

module.exports = { DailyReportSlackGateway }
