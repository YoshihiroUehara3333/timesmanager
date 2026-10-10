// src/features/home/index.js
const { lazy } = require('../../core/func/lazy')
const { logger } = require('../../core/logging/Logger')

const getHomeOpen = (dependencies) => {
  const { HomeOpenUseCase } = require('./application/HomeOpenUseCase')
  return new HomeOpenUseCase(dependencies)
}

function registerHomeFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  const usecaseDependencies = {
    slackApiAdaptor,
    backendHttpClient
  }

  const homeOpen = lazy(
    () => getHomeOpen(usecaseDependencies)
  )

  // Bolt登録
  // ホーム画面オープン時のイベント
  app.event(
    'app_home_opened',
    async ({ body, event }) => {
      logger.info('app_home_opened', {
        event: event,
        body: body
      })
      const result = await homeOpen().execute({
        userId: body.event.user,
      })
      logger.info('HomeOpen Completed', {
        result: result
      })
    }
  )
}

module.exports = { registerHomeFeature }
