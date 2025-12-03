// src/features/task/index.js

const { StartTaskInputUseCase } = require('./StartTaskInputUseCase')
const { SubmitTaskUseCase } = require('./SubmitTaskUseCase')

const { TaskBackendGateway } = require('../../core/backend/TaskBackendGateway')
const { ThreadBackendGateway } = require('../../core/backend/ThreadBackendGateway')

const { TaskSlackGateway } = require('./TaskSlackGateway')

function registerTaskFeature({ app, slackApiAdaptor, backendHttpClient }) {
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
    backendGateway,
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
    async ({ command, ack, respond }) => {
      await ack()
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
    async ({ body, ack }) => {
      await ack()
      await submitUseCase.execute({ 
        view: body.view, 
        userId: body.user.id 
      })
    },
  )
}

module.exports = { registerTaskFeature }