// src/lambda.js

const { AwsLambdaReceiver } = require('@slack/bolt')
const { createBoltApp } = require('./app')

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
})

createBoltApp({ receiver: awsLambdaReceiver })

const handler = awsLambdaReceiver.toHandler()

exports.handler = async (event, context) => {
  return await handler(event, context)
}
