// src/features/dailyreport/index.js

const { StartDailyReportInputUseCase } = require('./application/StartDailyReportInputUseCase')
const { SubmitDailyReportUseCase } = require('./application/SubmitDailyReportUseCase')

const { DailyReportBackendGateway } = require('./infra/DailyReportBackendGateway')

const { ModalConst } = require('../../shared/constants/ModalConst')

function registerDailyReportFeature ({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new DailyReportBackendGateway(slackApiAdaptor)
  const dailyreportBackendGateway = new DailyReportBackendGateway(backendHttpClient)

  // UseCase
  const startUseCase = new StartDailyReportInputUseCase({
    slackGateway,
    dailyreportBackendGateway,
  })
  const submitUseCase = new SubmitDailyReportUseCase({
    slackGateway,
    dailyreportBackendGateway,
  })

  // Bolt登録
  // ホームタブの「日報作成」ボタン押下
  app.action(
    ModalConst.ACTION_ID.HOME.DAILYREPORT,
    async ({ body, ack, logger }) => {
      await ack()
      logger.info(`app.action\nbody:${JSON.stringify(body)}`)
      await startUseCase.execute({
        userId: body.user.id,
        triggerId: body.trigger_id,
      })
    },
  )

  // 日報入力モーダルの submit
  app.view(
    { type: 'view_submission', callback_id: ModalConst.CALLBACK_ID.DAILYREPORT_INPUT },
    async ({ body, ack, view }) => {
      await ack()
      console.log(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`)
      await submitUseCase.execute({
        view: body.view,
        userId: body.user.id
      })
    },
  )
}

module.exports = { registerDailyReportFeature }
