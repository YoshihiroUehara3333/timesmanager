// src/features/home/application/HomeOpenUseCase.js

const { HomeBlocks } = require('../blockkit/HomeBlocks')
const { getDate } = require('../../../shared/utils/DateUtils')
const { TaskConst } = require('../../../shared/constants/TaskConst')

class HomeOpenUseCase {
  constructor ({ slackGateway, taskBackendGateway, threadBackendGateway }) {
    this.slackGateway = slackGateway
    this.taskBackendGateway = taskBackendGateway
    this.threadBackendGateway = threadBackendGateway
  }

  async execute ({ userId }) {
    console.log(`HomeOpenUseCase.execute userId:${userId}`)

    const date = getDate('YYYY-MM-DD')

    // スレッド存在確認
    let tasks = []
    const thread = await this.threadBackendGateway.getThread({ userId, date })
    if (thread.ok && thread.data) {
      // タスクリスト取得
      tasks = await this.taskBackendGateway.getTasks({ userId })
      if (tasks.ok && tasks.data) {
        // activeなもので絞り込む
        tasks = tasks.data.filter((task) => task.status === TaskConst.STATUS.ACTIVE)
      }
    }

    // BlockKit作成
    const view = HomeBlocks({
      tasks: tasks,
      thread: thread.data,
    })

    // ホーム画面を更新
    await this.slackGateway.updateHome({
      userId: userId,
      view: view,
    })
  }
}

module.exports = { HomeOpenUseCase }
