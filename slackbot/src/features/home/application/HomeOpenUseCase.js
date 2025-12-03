// src/features/home/application/HomeOpenUseCase.js

const { HomeBlocks } = require('../blockkit/HomeBlocks')
const { getDate } = require('../../../shared/utils/DateUtils')

class HomeOpenUseCase {
    constructor({ slackGateway, taskBackendGateway, threadBackendGateway }) {
        this.slackGateway = slackGateway
        this.taskBackendGateway = taskBackendGateway
        this.threadBackendGateway = threadBackendGateway
    }

    async execute({ userId }) {
        const date = getDate('YYYY-MM-DD')
        
        // スレッド存在確認
        let tasks = []
        let thread = await this.threadBackendGateway.getThread({userId, date})
        if (thread) {
            // タスクリスト取得
            tasks = await this.taskBackendGateway.getTasks({userId})
            if (tasks.length) {
                // activeなもので絞り込む
                tasks = tasks.filter((task) => task.status === TaskConst.STATUS.ACTIVE)
            }
        }
        
        // BlockKit作成
        const view = HomeBlocks({
            tasks: tasks,
            thread: thread,
        })

        // ホーム画面を更新
        this.slackGateway.updateHome({
            userId: userId,
            view: view,
        })
    }
}

module.exports = { HomeOpenUseCase }