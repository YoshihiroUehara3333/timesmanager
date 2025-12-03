// src/lambda.js

const { AwsLambdaReceiver } = require('@slack/bolt')
const { createBoltApp } = require('./app')

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
})

// eslint-disable-next-line no-unused-vars
const app = createBoltApp({ receiver: awsLambdaReceiver })
const handler = awsLambdaReceiver.toHandler()

// ハンドラー生成
exports.handler = async (event, context, callback) => {
  return await handler(event, context, callback)
}
