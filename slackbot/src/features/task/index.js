// src/features/task/index.js

const { StartTaskInputUseCase } = require('./application/StartTaskInputUseCase')
const { SubmitTaskUseCase } = require('./application/SubmitTaskUseCase')

const { TaskSlackGateway } = require('./infra/TaskSlackGateway')
const { TaskBackendGateway } = require('./infra/TaskBackendGateway')
const { ThreadBackendGateway } = require('../thread/infra/ThreadBackendGateway')

const { ModalConst } = require('../../shared/constants/ModalConst')
const { SlackConst } = require('../../shared/constants/SlackConst')

function registerTaskFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new TaskSlackGateway(slackApiAdaptor)
  const taskBackendGateway = new TaskBackendGateway(backendHttpClient)
  const threadBackendGateway = new ThreadBackendGateway(backendHttpClient)

  // UseCase
  const startInputUseCase = new StartTaskInputUseCase({
    slackGateway,
    taskBackendGateway,
    threadBackendGateway,
  })
  const submitUseCase = new SubmitTaskUseCase({
    slackGateway,
    taskBackendGateway,
    threadBackendGateway,
  })

  // Bolt登録
  // ホームタブの「タスク入力」ボタン押下
  app.action(
    ModalConst.ACTION_ID.HOME.TASK_INPUT,
    async ({ body, ack }) => {
      await ack()
      await startInputUseCase.execute({
        userId: body.user.id,
        triggerId: body.trigger_id,
      })
    },
  )

  // /newtask で呼ばれる
  app.command(
    SlackConst.APPCOMMANDS.NEWTASK,
    async ({ command, ack, context, logger, respond }) => {
      await ack()
      logger.info(`app.command\ncontext:${JSON.stringify(context)}\ncommand:${JSON.stringify(command)}\n`)
      await startInputUseCase.execute({
        userId: command.user_id,
        channelId: command.channel_id,
        text: command.text,
        respond,
      })
    }
  )

  // 勤怠入力モーダルの submit
  app.view(
    ModalConst.CALLBACK_ID.TASK_INPUT,
    async ({ body, ack, logger, view }) => {
      await ack()
      logger.info(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`)
      await submitUseCase.execute({
        view: body.view,
        userId: body.user.id
      })
    },
  )
}

module.exports = { registerTaskFeature }
