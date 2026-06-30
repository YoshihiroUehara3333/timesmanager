
// src/features/thread/application/SaveThreadReplyUseCase.js

const { getDate } = require('../../../shared/utils/DateUtils')

class SaveThreadReplyUseCase {
  constructor ({
    threadBackendGateway: threadBackend
  }) {
    this.threadBackend = threadBackend
  }

  /**
   * 
   * @param {*} param0 
   * @returns 
   */
  async execute ({
    userId,
    channelId,
    parentTs,
    replyTs,
    text
  }) {
    console.log(`SaveThreadReplyUseCase.execute userId:${userId} channelId:${channelId}`)
    const date = getDate('YYYY-MM-DD')

    await this.threadBackend.saveReply({
      userId: userId,
      channelId: channelId,
      parentTs: parentTs,
      replyTs: replyTs,
      date: date,
      text: text,
    })
    return null
  }
}

module.exports = { SaveThreadReplyUseCase }
