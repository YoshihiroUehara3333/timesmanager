// src/features/task/application/StartTaskInputUseCase.js

const { TaskInputModal } = require('../blockkit/TaskInputModal')
const { TaskConst } = require('../../../shared/constants/TaskConst')
const { getDate } = require('../../../shared/utils/DateUtils')

class StartTaskInputUseCase {
  constructor ({ slackGateway, taskBackendGateway, threadBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
    this.threadBackendGateway = threadBackendGateway
  }

  /**
     * 「タスク新規入力」を開始するユースケース
     */
  async execute ({ userId, triggerId }) {
    console.log(`StartTaskInputUseCase.execute userId:${userId} triggerId:${triggerId}`)

    const date = getDate('YYYY-MM-DD')

    // スレッド存在チェック
    const thread = await this.threadBackendGateway.getThread({ userId, date })
    if (!thread.ok || !thread.data) {
      return null
    }

    // 最新シリアル取得
    const response = await this.taskBackendGateway.issueLatestSerial({ userId: userId, date: date })
    if (!response.ok || !response.data) {
      return null
    }
    const serial = response.data

    // BlockKit作成
    const params = {
      channelId: thread.data.channelId,
      userId: userId,
      threadTs: thread.data.threadTs,
      date: date,
      serial: serial,
      status: TaskConst.STATUS.ACTIVE,
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

module.exports = { StartTaskInputUseCase }
