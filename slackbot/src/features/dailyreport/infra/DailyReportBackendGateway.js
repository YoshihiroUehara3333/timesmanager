// src/features/dailyreport/infra/DailyReportBackendGateway.js

const { BackendGatewayBase } = require('../../../core/backend/BackendGatewayBase')
const { BackendRouting } = require('../../../shared/constants/BackendRouting')

class DailyReportBackendGateway extends BackendGatewayBase {
  /**
     * 日報情報を取得する
     * @param {string} userId
     * @param {string} date
     * @returns
     */
  async getDailyReport ({ userId, date }) {
    console.log(`DailyReportBackendGateway.getDailyReport userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.DAILYREPORT.GET,
        config: {
          params: {
            userId: userId,
            date: date,
          },
        }
      })
      console.log(`DailyReportBackendGateway.getDailyReport response:${JSON.stringify(response)}`)
      return { ok: true, data: response }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }

  /**
     * 日報の登録/更新
     * @param {Object} dailyreport
     * @param {string} dailyreport.userId
     * @param {string} dailyreport.date
     * @param {string} dailyreport.task
     * @param {string} dailyreport.impressions
     * @returns
     */
  async saveDailyReport ({ userId, date, task, impressions }) {
    console.log(`DailyReportBackendGateway.saveDailyReport userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.DA.SAVE,
        data: {
          date: date,
          userId: userId,
          task: task,
          impressions: impressions,
        }
      })
      console.log(`DailyReportBackendGateway.saveDailyReport response:${JSON.stringify(response)}`)
      return { ok: true, data: response }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }
}

module.exports = { DailyReportBackendGateway }
