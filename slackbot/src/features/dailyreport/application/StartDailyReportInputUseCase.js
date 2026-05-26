// src/features/dailyreport/application/StartDailyReportInputUseCase.js

const { DailyReportInputModal } = require('../blockkit/DailyReportInputModal')
const { getDate } = require('../../../shared/utils/DateUtils')

class StartDailyReportInputUseCase {
  constructor ({ slackGateway, dailyreportBackendGateway }) {
    this.slackGateway = slackGateway
    this.dailyreportBackendGateway = dailyreportBackendGateway
  }

  /**
   * ホームタブなどから「日報入力」を開始するユースケース
   * - 下書きデータがあれば取得し、モーダルを初期表示
   */
  async execute ({ userId, triggerId }) {
    console.log(`StartDailyReportInputUseCase.excecute userId:${userId} triggerId:${triggerId}`)

    const date = getDate('YYYY-MM-DD')

    let dailyreport = {}
    const response = await this.dailyreportBackendGateway.getDailyReport({ userId, date })
    if (response.ok) {
      dailyreport = response.data
    }

    // BlockKit作成
    const view = DailyReportInputModal({ userId, date, dailyreport })

    // モーダルを開く
    await this.slackGateway.openModal({
      triggerId,
      view,
    })

    return { ok: true }
  }
}

module.exports = { StartDailyReportInputUseCase }
