// src/features/attendance/index.js

const { StartAttendanceInputUseCase } = require('./application/StartAttendanceInputUseCase')
const { SubmitAttendanceUseCase } = require('./application/SubmitAttendanceUseCase')

const { AttendanceSlackGateway } = require('./infra/AttendanceSlackGateway')
const { AttendanceBackendGateway } = require('./infra/AttendanceBackendGateway')

const { ModalConst } = require('../../shared/constants/ModalConst')

function registerAttendanceFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new AttendanceSlackGateway(slackApiAdaptor)
  const attendanceBackendGateway = new AttendanceBackendGateway(backendHttpClient)

  // UseCase
  const startUseCase = new StartAttendanceInputUseCase({
    slackGateway,
    attendanceBackendGateway,
  })
  const submitUseCase = new SubmitAttendanceUseCase({
    slackGateway,
    attendanceBackendGateway,
  })

  // Bolt登録
  // ホームタブの「勤怠入力」ボタン押下
  app.action(
    ModalConst.ACTION_ID.HOME.ATTENDANCE,
    async ({ body, ack }) => {
      await ack()
      logger.info(`app.action\nbody:${JSON.stringify(body)}`)
      await startUseCase.execute({
        userId: body.user.id,
        triggerId: body.trigger_id,
      })
    },
  )

  // 勤怠入力モーダルの submit
  app.view(
    { type: 'view_submission', callback_id: ModalConst.CALLBACK_ID.ATTENDANCE_INPUT},
    async ({ body, ack, view, logger }) => {
      await ack()
      logger.info(`app.view\nbody:${JSON.stringify(body)}\nview:${JSON.stringify(view)}`)
      await submitUseCase.execute({ 
        view: body.view, 
        userId: body.user.id 
      })
    },
  )
}

module.exports = { registerAttendanceFeature }