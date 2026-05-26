// src/features/home/application/HomeOpenUseCase.js

const { getDate } = require('../../../shared/utils/DateUtils')

const { HomeBlocks } = require('../blockkit/HomeBlocks')

class HomeOpenUseCase {
  constructor ({ slackGateway, homeBackendGateway }) {
    this.slackGateway = slackGateway
    this.homeBackendGateway = homeBackendGateway
  }

  async execute ({ userId }) {
    console.log(`HomeOpenUseCase.execute userId:${userId}`)

    const date = getDate('YYYY-MM-DD')

    // スレッド存在確認
    const result = await this.homeBackendGateway.getForHome({ userId, date })

    // BlockKit作成
    const view = HomeBlocks({
      tasks: result.tasks,
      thread: result.thread,
    })

    // ホーム画面を更新
    await this.slackGateway.updateHome({
      userId: userId,
      view: view,
    })

    return { ok: true }
  }
}

module.exports = { HomeOpenUseCase }
