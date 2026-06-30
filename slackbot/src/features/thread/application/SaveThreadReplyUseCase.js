
// src/features/thread/application/SaveThreadReplyUseCase.js

class SaveThreadReplyUseCase {
  constructor ({
    threadBackendGateway: threadBackend
  }) {
    this.threadBackend = threadBackend
  }

  async execute ({ userId, channelId }) {
    return null
  }
}

module.exports = { SaveThreadReplyUseCase }
