// src/features/home/index.js

const { HomeOpenUseCase } = require('./application/HomeOpenUseCase')
const { HomeSlackGateway } = require('./infra/HomeSlackGateway')

const { HomeBackendGateway } = require('../home/infra/HomeBackendGateway')

function registerHomeFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new HomeSlackGateway(slackApiAdaptor)
  const homeBackendGateway = new HomeBackendGateway(backendHttpClient)

  // UseCase
  const homeOpenUseCase = new HomeOpenUseCase({
    slackGateway,
    homeBackendGateway
  })

  // Bolt登録
  // ホーム画面オープン時のイベント
  app.event(
    'app_home_opened',
    async ({ body, event, logger }) => {
      logger.info(`app.event\nevent:${JSON.stringify(event)}\nbody:${JSON.stringify(body)}\n`)
      await homeOpenUseCase.execute({
        userId: body.event.user,
      })
    }
  )
}

module.exports = { registerHomeFeature }
