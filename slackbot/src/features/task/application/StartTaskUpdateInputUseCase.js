// src/features/task/application/StartTaskUpdateInputUseCase.js

const { TaskInputModal } = require('../blockkit/TaskInputModal')

class StartTaskUpdateInputUseCase {
  constructor ({ slackGateway, taskBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
  }

  /**
     * 「タスク情報更新」を開始するユースケース
     */
  async execute ({ userId, triggerId }) {
    console.log(`StartTaskUpdateInputUseCase.execute userId:${userId} triggerId:${triggerId}`)

    // DBからタスク情報を取得

    // BlockKit作成
    const params = {
    }
    const view = TaskInputModal(params)

    // モーダルを開く
    await this.slackGateway.openModal({
      triggerId,
      view,
    })
    return { ok: true }
  }
}

module.exports = { StartTaskUpdateInputUseCase }