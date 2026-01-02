// src/features/task/SubmitTaskUseCase.js

const { TaskBlock } = require('../blockkit/TaskBlock')

class SubmitTaskUseCase {
  constructor ({ slackGateway, taskBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
  }

  /**
     * タスク入力モーダルの内容を保存するユースケース
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
      channelId: task.channelId,
      text: 'タスク送信',
      threadTs: task.threadTs,
      blocks: blocks,
    })

    // バックエンドにリクエスト送信
    await this.taskBackendGateway.saveTask(task)

    return { ok: true }
  }

  _getTaskDataFromView (view) {
    // 入力値を取得
    const metadata = JSON.parse(view.private_metadata)
    const values = view.state.values

    return {
      channeld: metadata.channelId,
      threadTs: metadata.threadTs,
      userId: metadata.userId,
      taskName: values.taskName.input.value,
      targetTime: values.targetTime.input.value,
      memo: values.memo.input.value,
      serial: metadata.serial,
    }
  }
}

module.exports = { SubmitTaskUseCase }
