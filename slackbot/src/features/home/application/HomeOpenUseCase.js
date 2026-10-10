// src/features/home/application/HomeOpenUseCase.js
const { logger } = require('../../../core/logging/Logger')

const { getDate } = require('../../../shared/utils/DateUtils')

const { HomeBlocks } = require('../blockkit/HomeBlocks')

const { HomeBackendGateway } = require('../infra/HomeBackendGateway')
const { HomeSlackGateway } = require('../infra/HomeSlackGateway')

const toHomeView = data => HomeBlocks({
  tasks: data?.tasks,
  thread: data?.thread,
})

class HomeOpenUseCase {
  constructor ({
    slackApiAdaptor,
    backendHttpClient
  }) {
    this.slackGateway = new HomeSlackGateway(slackApiAdaptor)
    this.homeBackendGateway = new HomeBackendGateway(backendHttpClient)
  }

  async execute ({ userId }) {
    logger.info('HomeOpen execute', {
      userId: userId,
    })
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
