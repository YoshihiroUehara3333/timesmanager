// src/features/task/SubmitTaskUseCase.js

const { TaskBlock } = require('../blockkit/TaskBlock')

class SubmitTaskUseCase {
  constructor ({ slackGateway, taskBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
  }

  /**
     * タスク新規入力モーダルの内容を保存するユースケース
     *
     * @param {Object} params
     * @param {Object} params.view  - Slack view payload
     */
  async execute ({ view }) {
    console.log(`SubmitTaskUseCase.execute view:${view}`)

    // 入力値を取得
    const task = this._getTaskDataFromView(view)

    // SlackにBlocksを送信
    const blocks = TaskBlock(task)
    await this.slackGateway.postTaskBlock({
      channelId: view.metadata.channelId,
      threadTs: view.metadata.threadTs,
      text: 'タスク送信',
      blocks: blocks,
    })

    // バックエンドにリクエスト送信
    await this.taskBackendGateway.createTask(task)

    return { ok: true }
  }

  // Helpers=============================================

  _getTaskDataFromView (view) {
    // 入力値を取得
    const metadata = JSON.parse(view.private_metadata)
    const values = view.state.values

    return {
      userId: metadata.userId,
      serial: metadata.serial,
      date: metadata.date,
      taskName: values.taskName.input.value,
      targetTime: values.targetTime.input.value,
      memo: values.memo.input.value || '',
      status: metadata.status,
    }
  }
}

module.exports = { SubmitTaskUseCase }
