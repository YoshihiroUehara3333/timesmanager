// src/features/home/index.js
const { lazy } = require('../../core/func/lazy')

const getUseCaseDependencies = ({
  slackApiAdaptor,
  backendHttpClient
}) => {
  const { HomeBackendGateway } = require('../home/infra/HomeBackendGateway')
  const { HomeSlackGateway } = require('./infra/HomeSlackGateway')

  return {
    homeBackendGateway: new HomeBackendGateway(backendHttpClient),
    slackGateway: new HomeSlackGateway(slackApiAdaptor)
  }
}

const getHomeOpen = (dependencies) => {
  const { HomeOpenUseCase } = require('./application/HomeOpenUseCase')
  return new HomeOpenUseCase(dependencies)
}

function registerHomeFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  const usecaseDependencies = getUseCaseDependencies({
    slackApiAdaptor,
    backendHttpClient
  })

  const homeOpen = lazy(
    () => getHomeOpen(usecaseDependencies)
  )

  // Bolt登録
  // ホーム画面オープン時のイベント
  app.event(
    'app_home_opened',
    async ({ body, event, logger }) => {
      logger.info(`app.event\nevent:${JSON.stringify(event)}\nbody:${JSON.stringify(body)}\n`)
      const result = await homeOpen().execute({
        userId: body.event.user,
      })
      logger.info(`homeOpe Completed\nresult:${JSON.stringify(result)}`)
    }
  )
}

module.exports = { registerHomeFeature }
