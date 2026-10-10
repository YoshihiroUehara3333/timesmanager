// src/features/makethread/index.js

const { lazy } = require('../../core/func/lazy')

const { SlackConst } = require('../../shared/constants/SlackConst')

/** UseCase依存作成 */
const getUseCaseDependencies = ({
  slackApiAdaptor,
  backendHttpClient
}) => {
  const { ThreadSlackGateway } = require('./infra/ThreadSlackGateway')
  const { ThreadBackendGateway } = require('./infra/ThreadBackendGateway')

  return {
    slackGateway: new ThreadSlackGateway(slackApiAdaptor),
    threadBackendGateway: new ThreadBackendGateway(backendHttpClient)
  }
}

/** UseCase生成 */
const getMakeThread = (dependencies) => {
  const { MakeThreadUseCase } = require('./application/MakeThreadUseCase')
  return new MakeThreadUseCase(dependencies)
}
const getSaveThreadReply = (dependencies) => {
  const { SaveThreadReplyUseCase } = require('./application/SaveThreadReplyUseCase')
  return new SaveThreadReplyUseCase(dependencies)
}

// スレッド内返信を受信して保存する
const isThreadReply = event => {
  return Boolean(event.thread_ts) &&
    event.parent_user_id !== event.user &&
    event.event_ts !== event.thread_ts &&
    !event.subtype
}

function registerThreadFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  const usecaseDependencies = getUseCaseDependencies({
    slackApiAdaptor,
    backendHttpClient
  })

  const makeThread = lazy(
    () => getMakeThread(usecaseDependencies)
  )
  const saveThreadReply = lazy(
    () => getSaveThreadReply(usecaseDependencies)
  )

  // Bolt登録
  // /makethread で呼ばれる
  app.command(
    SlackConst.APPCOMMANDS.MAKETHREAD,
    async ({ command, ack, context, logger, respond }) => {
      await ack()
      logger.info(`app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n`)
      const result = await makeThread().execute({
        userId: command.user_id,
        channelId: command.channel_id,
      })
      logger.info(`makeThread Completed\nresult:${JSON.stringify(result)}`)
      if (result.text) {
        await respond({
          text: result.text,
          response_type: 'ephemeral',
        })
      }
    }
  )
  app.event('message',
    async ({ event, logger }) => {
      logger.info(`app.event\nevent:${JSON.stringify(event)}`)
      if (!isThreadReply(event)) return
      // backendに保存
      await saveThreadReply().execute({
        userId: event.user_id,
        channelId: event.channel,
        parentTs: event.thread_ts,
        replyTs: event.event_ts,
        text: event.text,
      })
    }
  )
}

module.exports = { registerThreadFeature }
