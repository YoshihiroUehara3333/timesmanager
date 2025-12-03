// src/features/warmup/index.js
const { WarmUpCommandHandler } = require('./WarmUpCommandHandler')
const { WarmUpUseCase } = require('./WarmUpUseCase')
const { WarmUpSlackGateway } = require('./WarmUpSlackGateway')
const { SlackConst } = require('../../constants/SlackConst')

function registerWarmUpFeature({ app, slackApiAdaptor }) {
  // Gateway
  const slackGateway = new WarmUpSlackGateway(slackApiAdaptor)

  // UseCase
  const useCase = new WarmUpUseCase({
    slackGateway,
    backendGateway,
  })

  // Handler
  const handler = new WarmUpCommandHandler({ useCase })

  // Bolt登録
  app.command(
    SlackConst.APPCOMMANDS.WARMUP,
    handler.handle.bind(handler)
  )
}

module.exports = { registerWarmUpFeature }