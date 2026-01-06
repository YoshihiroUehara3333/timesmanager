// src/features/attendance/application/StartAttendanceInputUseCase.js

const { AttendanceInputModal } = require('../blockkit/AttendanceInputModal')
const { getDate } = require('../../../shared/utils/DateUtils')

class StartAttendanceInputUseCase {
  constructor ({ slackGateway, attendanceBackendGateway }) {
    this.slackGateway = slackGateway
    this.attendanceBackendGateway = attendanceBackendGateway
  }

  /**
   * ホームタブなどから「勤怠入力」を開始するユースケース
   * - 当日分の勤怠があれば取得し、モーダルを初期表示
   */
  async execute ({ userId, triggerId }) {
    console.log(`StartAttendanceInputUseCase.excecute userId:${userId} triggerId:${triggerId}`)

    const date = getDate('YYYY-MM-DD')

    // 勤怠を取得する
    let attendance = {}
    const response = await this.attendanceBackendGateway.getAttendanceByDate({ userId, date })
    if (response.ok) {
      attendance = response.data
    }

    // BlockKit作成
    const view = AttendanceInputModal({ userId, date, attendance })

    // モーダルを開く
    await this.slackGateway.openModal({
      triggerId,
      view,
    })
  }
}

module.exports = { StartAttendanceInputUseCase }
