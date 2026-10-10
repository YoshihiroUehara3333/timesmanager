// src/features/home/application/HomeOpenUseCase.js

const { getDate } = require('../../../shared/utils/DateUtils')

const { HomeBlocks } = require('../blockkit/HomeBlocks')

const toHomeView = data => HomeBlocks({
  tasks: data?.tasks,
  thread: data?.thread,
})

class HomeOpenUseCase {
  constructor ({ slackGateway, homeBackendGateway }) {
    this.slackGateway = slackGateway
    this.homeBackendGateway = homeBackendGateway
  }

  async execute ({ userId }) {
    console.log(`HomeOpenUseCase.execute userId:${userId}`)

    const date = getDate('YYYY-MM-DD')

    // 現在データ取得
    const result = await this.homeBackendGateway.getForHome({ userId, date })
    if (!result.ok) {
      return {
        ok: false,
        text: result.error?.message
      }
    }

    // ホーム画面を更新
    const updated = await this.slackGateway.updateHome({
      userId: userId,
      view: toHomeView(result.data),
    })
    return { ok: true, result: updated }
  }
}

module.exports = { HomeOpenUseCase }
