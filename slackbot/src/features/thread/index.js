// src/features/makethread/index.js

const { MakeThreadUseCase } = require('./application/MakeThreadUseCase')

const { ThreadSlackGateway } = require('./infra/ThreadSlackGateway')
const { ThreadBackendGateway } = require('./infra/ThreadBackendGateway')

const { TaskBackendGateway } = require('../task/infra/TaskBackendGateway')

const { SlackConst } = require('../../shared/constants/SlackConst')

function registerThreadFeature({ app, slackApiAdaptor, backendHttpClient }) {
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
    async ({ command, ack, context, respond }) => {
      await ack()
      logger.info(`app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n`)
      await makeThreadUseCase.execute({
        userId: command.user_id,
        channelId: command.channel_id,
        text: command.text,
        respond,
      })
    }
  )
}

module.exports = { registerThreadFeature }