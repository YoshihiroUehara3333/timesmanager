// src/features/task/application/StartUpdateMemoUseCase.js

class StartUpdateMemoUseCase {
  constructor ({ slackGateway, taskBackendGateway, threadBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
    this.threadBackendGateway = threadBackendGateway
  }

  /**
     * 「進捗メモ更新」を開始するユースケース
     */
  async execute ({ userId, triggerId }) {
    console.log(`StartUpdateMemoUseCase.execute userId:${userId} triggerId:${triggerId}`)
    return { ok: true }
  }
}

module.exports = { StartUpdateMemoUseCase }
