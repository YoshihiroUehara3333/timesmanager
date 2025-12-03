// src/features/home/index.js

const { HomeOpenUseCase } = require('./HomeOpenUseCase')
const { HomeSlackGateway } = require('./HomeOpenSlackGateway')

const { TaskBackendGateway } = require('../../core/backend/TaskBackendGateway')
const { ThreadBackendGateway } = require('../../core/backend/ThreadBackendGateway')

function registerHomeFeature({ app, slackApiAdaptor }) {
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