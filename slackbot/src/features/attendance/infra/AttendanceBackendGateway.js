// src/features/attendance/infra/AttendanceBackendGateway.js

const { BackendGatewayBase } = require('../../../core/backend/BackendGatewayBase')
const { BackendRouting } = require('../../../shared/constants/BackendRouting')

class AttendanceBackendGateway extends BackendGatewayBase {
  /**
     * 勤怠情報を取得する
     * @param {string} userId
     * @param {string} date
     * @returns
     */
  async getAttendance ({ userId, date }) {
    console.log(`AttendanceBackendGateway.getAttendance userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.ATTENDANCE.GET,
        config: {
          params: {
            userId: userId,
            date: date,
          },
        }
      })
      console.log(`AttendanceBackendGateway.getAttendance response:${JSON.stringify(response)}`)
      return { ok: true, data: response }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }

  /**
     * 勤怠の登録/更新
     * @param {Object} attendance
     * @param {string} attendance.userId
     * @param {string} attendance.date
     * @param {string} attendance.startTime
     * @param {string} attendance.endTime
     * @param {string} attendance.workplace
     * @returns
     */
  async saveAttendance ({ userId, date, startTime, endTime, workplace }) {
    console.log(`AttendanceBackendGateway.saveAttendance userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.ATTENDANCE.SAVE,
        data: {
          date: date,
          userId: userId,
          startTime: startTime,
          endTime: endTime,
          workplace: workplace,
        }
      })
      console.log(`AttendanceBackendGateway.saveAttendance response:${JSON.stringify(response)}`)
      return { ok: true, data: response }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }
}

module.exports = { AttendanceBackendGateway }
