// src/features/task/application/StartTaskInputUseCase.js

const { TaskInputModal } = require('../blockkit/TaskInputModal')
const { getDate } = require('../../../shared/utils/DateUtils')

const { TaskSlackGateway } = require('../infra/TaskSlackGateway')
const { TaskBackendGateway } = require('../infra/TaskBackendGateway')
const { ThreadBackendGateway } = require('../../thread/infra/ThreadBackendGateway')

class StartTaskInputUseCase {
  constructor ({ slackApiAdaptor, backendHttpClient }) {
    this.slackGateway = new TaskSlackGateway(slackApiAdaptor)
    this.taskBackendGateway = new TaskBackendGateway(backendHttpClient)
    this.threadBackendGateway = new ThreadBackendGateway(backendHttpClient)
  }

  /**
     * 「タスク新規入力」を開始するユースケース
     */
  async execute ({ userId, triggerId }) {
    console.log(`StartTaskInputUseCase.execute userId:${userId} triggerId:${triggerId}`)

    const date = getDate('YYYY-MM-DD')

    // スレッド存在チェック
    const thread = await this.threadBackendGateway.getThreadByDate({ userId, date })
    if (!thread.ok) return { ok: false }

    // BlockKit作成
    const params = {
      channelId: thread.channelId,
      threadTs: thread.threadTs,
      userId: userId,
      date: date
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
