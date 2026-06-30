
// src/features/thread/application/SaveThreadReplyUseCase.js

const { getDate } = require('../../../shared/utils/DateUtils')

class SaveThreadReplyUseCase {
  constructor ({
    threadBackendGateway: threadBackend
  }) {
    this.threadBackend = threadBackend
  }

  async execute ({
    userId,
    channeId,
    parentTs,
    replyTs,
    text
  }) {
    const date = getDate('YYYY-MM-DD')

    await this.threadBackend.saveReply({
      userId: userId,
      channeId: channeId,
      parentTs: parentTs,
      replyTs: replyTs,
      date: date,
      text: text,
    })
    return null
  }
}

module.exports = { SaveThreadReplyUseCase }
