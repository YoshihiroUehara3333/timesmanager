// src/features/task/infra/TaskSlackGateway.js

const { SlackGatewayBase } = require('../../../core/slack/SlackGatewayBase')

class TaskSlackGateway extends SlackGatewayBase {
  /**
   * メッセージを送信する
   */
  async postMessage ({ channelId, text }) {
    const message = await this.slackApiAdaptor.postMessage({
      channelId: channelId,
      text,
    })

    return message
  }

  async openModal ({ triggerId, view }) {
    await this.slackApiAdaptor.viewsOpen({
      triggerId: triggerId,
      view,
    })
  }

  async postTaskBlock ({ channelId, text, threadTs, blocks }) {
    const message = await this.slackApiAdaptor.postMessage({
      channelId: channelId,
      text: text,
      threadTs: threadTs,
      blocks: blocks,
    })
    return message
  }
}

module.exports = { TaskSlackGateway }
