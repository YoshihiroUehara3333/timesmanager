// src/features/thread/infra/ThreadSlackGateway.js

const { SlackGatewayBase } = require("../../../core/slack/SlackGatewayBase")

class ThreadSlackGateway extends SlackGatewayBase{
  /**
   * スレッドの「親」メッセージを投稿し、permalinkまで取得して返す
   */
  async postThread({ channelId, text }) {
    const message = await this.slackApiAdaptor.postMessage({
      channel: channelId,
      text,
    })

    const permalink = await this.slackApiAdaptor.getPermalink({
      channel: message.channel,
      messageTs: message.ts,
    })

    return {
      channelId: message.channel,
      threadTs: message.ts,
      permalink,
    }
  }
}

module.exports = { ThreadSlackGateway }