// src/features/attendance/index.js

const { StartAttendanceInputUseCase } = require('./StartAttendanceInputUseCase')
const { SubmitAttendanceUseCase } = require('./SubmitAttendanceUseCase')
const { AttendanceSlackGateway } = require('./AttendanceSlackGateway')

const { AttendanceBackendGateway } = require('../../core/backend/AttendanceBackendGateway')
const { TaskBackendGateway } = require('../../core/backend/TaskBackendGateway')
const { ThreadBackendGateway } = require('../../core/backend/ThreadBackendGateway')

const { ModalConst } = require('../../constants/ModalConst')

function registerAttendanceFeature({ app, slackApiAdaptor, backendHttpClient }) {
  // Gateway
  const slackGateway = new AttendanceSlackGateway(slackApiAdaptor)
  const attendanceBackendGateway = new AttendanceBackendGateway(backendHttpClient)
  const taskBackendGateway = new TaskBackendGateway(backendHttpClient)
  const threadBackendGateway = new ThreadBackendGateway(backendHttpClient)

  // UseCase
  const startUseCase = new StartAttendanceInputUseCase({
    slackGateway,
    attendanceBackendGateway,
  })
  const submitUseCase = new SubmitAttendanceUseCase({
    attendanceBackendGateway,
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