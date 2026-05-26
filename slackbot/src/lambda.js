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
  const body = JSON.parse(event.body || '{}')

  // Slack URL verification
  if (body.type === 'url_verification') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: body.challenge,
    }
  }

  return await handler(event, context)
}