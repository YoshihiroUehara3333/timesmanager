// src/features/home/index.js

const { HomeOpenUseCase } = require('./HomeOpenUseCase')
const { HomeSlackGateway } = require('./HomeOpenSlackGateway')
const { HomeBackendGateway } = require('./HomeBackendGateway')

function registerHomeFeature({ app, slackApiAdaptor }) {
  // Gateway
  const slackGateway = new HomeSlackGateway(slackApiAdaptor)
  const backendGateway = new HomeBackendGateway(backendHttpClient)

  // UseCase
  const homeOpenUseCase = new HomeOpenUseCase({
    slackGateway,
    backendGateway,
  })


  // Bolt登録
  // ホーム画面オープン時
  app.event(
    { type: 'app_home_opened' },
    async ({ body, ack }) => {
      await ack()
      await homeOpenUseCase.execute({
        userId: body.event.user,
      })
    }
  )
}

module.exports = { registerHomeFeature }