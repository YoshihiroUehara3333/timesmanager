// src/features/task/application/StartAddProgressionUseCase.js

class StartAddProgressionUseCase {
  constructor ({ slackGateway, taskBackendGateway, threadBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
    this.threadBackendGateway = threadBackendGateway
  }

  /**
     * 「進捗記録追加」を開始するユースケース
     */
  async execute ({ userId, triggerId }) {
    console.log(`StartAddProgressionUseCase.execute userId:${userId} triggerId:${triggerId}`)
    return { ok: true }
  }
}

module.exports = { StartAddProgressionUseCase }
