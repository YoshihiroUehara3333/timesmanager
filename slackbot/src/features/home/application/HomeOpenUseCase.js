// src/features/home/application/HomeOpenUseCase.js

const { getDate } = require('../../../shared/utils/DateUtils')

const { HomeBlocks } = require('../blockkit/HomeBlocks')
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
    const threadResult = await this.threadBackendGateway.getThreadByDate({ userId, date })
    if (threadResult.status === 200) {
      // タスクリスト取得
      const taskResult = await this.taskBackendGateway.getAllTasks({ userId })
      if (taskResult.status === 200) {
        // activeなもので絞り込む
        tasks = taskResult.data.filter((task) => task.status === TaskConst.STATUS.ACTIVE)
      }
    }

    // BlockKit作成
    const view = HomeBlocks({
      tasks: tasks,
      thread: threadResult.data,
    })
    console.log(JSON.stringify(view))

    // ホーム画面を更新
    await this.slackGateway.updateHome({
      userId: userId,
      view: view,
    })

    return { ok: true }
  }
}

module.exports = { HomeOpenUseCase }
