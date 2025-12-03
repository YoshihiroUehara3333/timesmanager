// src/features/home/index.js

const { HomeOpenUseCase } = require('./application/HomeOpenUseCase')
const { HomeSlackGateway } = require('./infra/HomeSlackGateway')

const { TaskBackendGateway } = require('../task/infra/TaskBackendGateway')
const { ThreadBackendGateway } = require('../thread/infra/ThreadBackendGateway')

function registerHomeFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new HomeSlackGateway(slackApiAdaptor)
  const taskBackendGateway = new TaskBackendGateway(backendHttpClient)
  const threadBackendGateway = new ThreadBackendGateway(backendHttpClient)

  // UseCase
  const homeOpenUseCase = new HomeOpenUseCase({
    slackGateway,
    taskBackendGateway,
    threadBackendGateway,
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