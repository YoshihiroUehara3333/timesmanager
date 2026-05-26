// src/features/warmup/index.js
const { WarmUpCommandHandler } = require('./interface/WarmUpCommandHandler')
const { WarmUpUseCase } = require('./application/WarmUpUseCase')

const { SlackConst } = require('../../shared/constants/SlackConst')

function registerWarmUpFeature ({ app, slackApiAdaptor }) {
  // UseCase
  const useCase = new WarmUpUseCase()

  // Handler
  const handler = new WarmUpCommandHandler({ useCase })

  // Bolt登録
  app.command(
    SlackConst.APPCOMMANDS.WARMUP,
    handler.handle.bind(handler)
  )
}

module.exports = { registerWarmUpFeature }
