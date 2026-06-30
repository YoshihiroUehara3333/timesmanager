// src/lambda.js

const { AwsLambdaReceiver } = require('@slack/bolt')
const { createBoltApp } = require('./app')

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
})

createBoltApp({ receiver: awsLambdaReceiver })

exports.handler = awsLambdaReceiver.toHandler()
