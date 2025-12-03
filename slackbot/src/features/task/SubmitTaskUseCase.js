// src/features/task/SubmitTaskUseCase.js

const { TaskBlock } = require('./TaskBlock')

class SubmitTaskUseCase {
    constructor({ slackGateway, taskBackendGateway }) {
        this.slackGateway = slackGateway
        this.taskBackendGateway = taskBackendGateway
    }

    /**
     * タスク入力モーダルの内容を保存するユースケース
     *
     * @param {Object} params
     * @param {Object} params.view  - Slack view payload
     */
    async execute({ view }) {
        // 入力値を取得
        const metadata = JSON.parse(view.private_metadata)
        const values = view.state.values

        const task = {
            userId: metadata.user_id,
            taskName: values.taskName.input.value,
            targetTime: values.targetTime.input.value,
            memo: values.memo.input.value,
            serial: metadata.serial,
        }

        // SlackにBlocksを送信
        const blocks = TaskBlock(task)
        await this.slackGateway.postTaskBlock({
            channelId: metadata.channel_id,
            text: 'タスク送信',
            threadTs: metadata.threadTs,
            blocks: blocks,
        })

        // バックエンドにリクエスト送信
        await this.taskBackendGateway.saveTask(task)
    }
}

module.exports = { SubmitTaskUseCase }