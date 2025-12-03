// src/features/makethread/index.js

const { MakeThreadUseCase } = require('./MakeThreadUseCase')
const { ThreadSlackGateway } = require('./ThreadSlackGateway')

const { TaskBackendGateway } = require('../../core/backend/TaskBackendGateway')
const { ThreadBackendGateway } = require('../../core/backend/ThreadBackendGateway')

const { SlackConst } = require('../../constants/SlackConst')

function registerMakeThreadFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new ThreadSlackGateway(slackApiAdaptor)
  const taskBackendGateway = new TaskBackendGateway(backendHttpClient)
  const threadBackendGateway = new ThreadBackendGateway(backendHttpClient)

  // UseCase
  const makeThreadUseCase = new MakeThreadUseCase({
    slackGateway,
    threadBackendGateway,
  })

  // Bolt登録
  // /makethread で呼ばれる
  app.command(
    SlackConst.APPCOMMANDS.MAKETHREAD,
    async ({ command, ack, respond }) => {
      await ack()
      await makeThreadUseCase.execute({
        userId: command.user_id,
        channelId: command.channel_id,
        text: command.text,
        respond,
      })
    }
  )
}

module.exports = { registerMakeThreadFeature }