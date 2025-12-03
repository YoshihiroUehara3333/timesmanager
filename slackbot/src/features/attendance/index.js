// src/features/attendance/index.js

const { StartAttendanceInputUseCase } = require('./StartAttendanceInputUseCase')
const { SubmitAttendanceUseCase } = require('./SubmitAttendanceUseCase')
const { AttendanceGateway } = require('./AttendanceSlackGateway')
const { ModalConst } = require('../../constants/ModalConst')

function registerAttendanceFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new AttendanceSlackGateway(slackApiAdaptor)
  const backendGateway = new AttendanceBackendGateway(backendHttpClient)

  // UseCase
  const startUseCase = new StartAttendanceInputUseCase({
    slackGateway,
    backendGateway,
  })

  const submitUseCase = new SubmitAttendanceUseCase({
    backendGateway,
    slackGateway,
  })

  // Bolt登録
  // ホームタブの「勤怠入力」ボタン押下
  app.action(
    ModalConst.ACTION_ID.HOME.ATTENDANCE,
    async ({ body, ack }) => {
      await ack()
      await startUseCase.execute({
        userId: body.user.id,
        triggerId: body.trigger_id,
      })
    },
  )

  // 勤怠入力モーダルの submit
  app.view(
    ModalConst.CALLBACK_ID.ATTENDANCE_INPUT,
    async ({ body, ack }) => {
      await ack()
      await submitUseCase.execute({ 
        view: body.view, 
        userId: body.user.id 
      })
    },
  )
}

module.exports = { registerAttendanceFeature }