// src/features/makethread/ThreadSlackGateway.js

class ThreadSlackGateway {
  constructor(slackApiAdaptor) {
    this.slackApiAdaptor = slackApiAdaptor
  }

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