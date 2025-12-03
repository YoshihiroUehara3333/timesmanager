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
    async getAttendance({ userId, date }) {
        const response = await this.backendHttpClient.request({
            routing: BackendRouting.ATTENDANCE.GET,
            config: {
                params: {
                    userId: userId,
                    date: date,
                },
            }
        })

        return response
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
    async saveAttendance({ userId, date, startTime, endTime, workplace }) {
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
    }
}

module.exports = { AttendanceBackendGateway }