// src/features/makethread/index.js

const { MakeThreadUseCase } = require('./MakeThreadUseCase')
const { MakeThreadSlackGateway } = require('./MakeThreadSlackGateway')
const { MakeThreadBackendGateway } = require('./MakeThreadBackendGateway')
const { SlackConst } = require('../../constants/SlackConst')

function registerMakeThreadFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new MakeThreadSlackGateway(slackApiAdaptor)
  const backendGateway = new MakeThreadBackendGateway(backendHttpClient)

  // UseCase
  const makeThreadUseCase = new MakeThreadUseCase({
    slackGateway,
    backendGateway,
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