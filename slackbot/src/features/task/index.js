// src/features/task/index.js

const { ModalConst } = require('../../shared/constants/ModalConst')
const { SlackConst } = require('../../shared/constants/SlackConst')

/** UseCase依存作成 */
const getUseCaseDependencies = ({ slackApiAdaptor, backendHttpClient }) => {
  const { TaskSlackGateway } = require('./infra/TaskSlackGateway')
  const { TaskBackendGateway } = require('./infra/TaskBackendGateway')
  const { ThreadBackendGateway } = require('./infra/ThreadBackendGateway')
  return {
    slackGateway: new TaskSlackGateway(slackApiAdaptor),
    taskBackendGateway: new TaskBackendGateway(backendHttpClient),
    threadBackendGateway: new ThreadBackendGateway(backendHttpClient)
  }
}

/** UseCase生成 */
const getStartTaskInput = (dependencies) => {
  const { StartTaskInputUseCase } = require('./application/StartTaskInputUseCase')
  return new StartTaskInputUseCase(dependencies)
}
const getSubmitTask = (dependencies) => {
  const { SubmitTaskUseCase } = require('./application/SubmitTaskUseCase')
  return new SubmitTaskUseCase(dependencies)
}

function registerTaskFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  const usecaseDependencies = getUseCaseDependencies({
    slackApiAdaptor,
    backendHttpClient
  })

  // UseCase
  const startTaskInput = lazy(
    () => getStartTaskInput(usecaseDependencies)
  )
  const submitTask = lazy(
    () => getSubmitTask(usecaseDependencies)
  )

  // Bolt登録
  // ホームタブの「タスク入力」ボタン押下
  app.action(
    ModalConst.ACTION_ID.HOME.TASK_INPUT,
    async ({ body, ack, logger }) => {
      await ack()
      logger.info(`app.action\nbody:${body}`)
      await startTaskInput().execute({
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
      await startTaskInput().execute({
        userId: command.user_id,
        channelId: command.channel_id,
        text: command.text,
        respond,
      })
    }
  )

  // 勤怠入力モーダルの submit
  app.view(
    { type: 'view_submission', callback_id: ModalConst.CALLBACK_ID.TASK_INPUT },
    async ({ body, ack, logger, view }) => {
      await ack()
      logger.info(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`)
      await submitTask().execute({
        view: body.view,
        userId: body.user.id
      })
    },
  )
}

module.exports = { registerTaskFeature }
