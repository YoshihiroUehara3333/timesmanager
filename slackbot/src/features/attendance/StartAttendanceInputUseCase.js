// src/features/attendance/StartAttendanceInputUseCase.js

const { AttendanceInputModal } = require('./AttendanceInputModal')

class StartAttendanceInputUseCase {
  constructor({ slackGateway, backendGateway }) {
    this.slackGateway = slackGateway
    this.backendGateway = backendGateway
  }

  /**
   * ホームタブなどから「勤怠入力」を開始するユースケース
   * - 当日分の勤怠があれば取得し、モーダルを初期表示
   */
  async execute({ userId, triggerId }) {
    const date = getDate('YYYY-MM-DD')

    // 勤怠を取得する
    const attendance = await this.backendGateway.getAttendance({ userId, date })

    // BlockKit作成
    const modalView = AttendanceInputModal({
      userId,
      date,
      attendance: attendance,
    })

    // モーダルを開く
    await this.slackGateway.openModal({
      triggerId,
      view: modalView,
    })
  }
}

module.exports = { StartAttendanceInputUseCase }