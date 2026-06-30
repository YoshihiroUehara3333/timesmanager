// src/features/makethread/index.js

const { MakeThreadUseCase } = require('./application/MakeThreadUseCase')
const { SaveThreadReplyUseCase } = require('./application/SaveThreadReplyUseCase')

const { ThreadSlackGateway } = require('./infra/ThreadSlackGateway')
const { ThreadBackendGateway } = require('./infra/ThreadBackendGateway')

const { SlackConst } = require('../../shared/constants/SlackConst')

function registerThreadFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slack = new ThreadSlackGateway(slackApiAdaptor)
  const threadBackend = new ThreadBackendGateway(backendHttpClient)

  // UseCase
  const makeThread = new MakeThreadUseCase({
    slackGateway: slack,
    threadBackendGateway: threadBackend,
  })
  const saveThreadReply = new SaveThreadReplyUseCase({
    threadBackendGateway: threadBackend,
  })

  // Bolt登録
  // /makethread で呼ばれる
  app.command(
    SlackConst.APPCOMMANDS.MAKETHREAD,
    async ({ command, ack, context, logger, respond }) => {
      await ack()
      logger.info(`app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n`)
      await makeThread.execute({
        userId: command.user_id,
        channelId: command.channel_id,
        respond,
      })
    }
  )

  // スレッド内返信を受信して保存する
  app.event('message', async ({ event, logger }) => {
    if (!event.thread_ts) return
    if (event.parent_user_id !== event.user) return
    if (event.ts === event.thread_ts) return
    if (event.subtype) return

    logger.info(`app.event\nevent:${JSON.stringify(event)}`)

    // backendに保存
    await saveThreadReply.execute({
      userId: event.user_id,
      channeId: event.channel,
      parentTs: event.thread_ts,
      replyTs: event.event_ts,
      text: event.text,
    })
  })
}

module.exports = { registerThreadFeature }
