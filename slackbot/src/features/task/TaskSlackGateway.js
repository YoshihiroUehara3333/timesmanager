// src/features/task/TaskSlackGateway.js

class TaskSlackGateway {
  constructor(slackApiAdaptor) {
    this.slackApiAdaptor = slackApiAdaptor
  }

  /**
   * メッセージを送信する
   */
  async postMessage({ channelId, text }) {
    const message = await this.slackApiAdaptor.postMessage({
      channel: channelId,
      text,
    })
  }

  async openModal ({ triggerId, view }) {
    await this.slackApiAdaptor.viewsOpen({
        triggerId,
        view,
    })
  }
}

module.exports = { TaskSlackGateway }