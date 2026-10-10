// src/lambda.js

const { AwsLambdaReceiver } = require('@slack/bolt')
const { createBoltApp, setUpContainer, registerFeatures } = require('./app')

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
})

const app = createBoltApp({ receiver: awsLambdaReceiver })
const container = setUpContainer({ app })
registerFeatures({ container })

const boltHandler = awsLambdaReceiver.toHandler()

const { withRequestContext } = require('./core/logging/RequestContext')
const { logger } = require('./core/logging/Logger')

async function handler (event, context) {
  context.logger = logger
  return withRequestContext(
    { requestId: context.awsRequestId },
    async () => {
      const started = performance.now()
      logger.info('request.started')

      try {
        return await boltHandler(event, context)
      } catch (error) {
        logger.error('request.failed', error)
        throw error
      } finally {
        logger.info('request.finished', {
          durationMs: Math.round(performance.now() - started),
        })
      }
    }
  )
}
module.exports.handler = handler
