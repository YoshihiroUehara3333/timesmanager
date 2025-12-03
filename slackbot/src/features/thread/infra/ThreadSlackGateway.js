// src/features/thread/infra/ThreadSlackGateway.js

const { SlackGatewayBase } = require('../../../core/slack/SlackGatewayBase')

class ThreadSlackGateway extends SlackGatewayBase {
  /**
   * スレッドの「親」メッセージを投稿し、permalinkまで取得して返す
   */
  async postThread ({ channelId, text }) {
    console.log(`ThreadSlackGateway.postThread channelId:${channelId} text:${text}`)

    const message = await this.slackApiAdaptor.postMessage({
      channelId: channelId,
      text,
    })

    const permalink = await this.slackApiAdaptor.getPermalink({
      channeId: message.channel,
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
