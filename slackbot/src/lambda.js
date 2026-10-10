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

async function handler (event, context) {
  return await boltHandler(event, context)
}

module.exports.handler = handler
