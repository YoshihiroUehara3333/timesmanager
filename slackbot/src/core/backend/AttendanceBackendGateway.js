// src/core/backend/AttendanceBackendGateway.js

const { BackendRouting } = require('../../constants/BackendRouting')

class AttendanceBackendGateway {
    constructor(backendHttpClient) {
        this.backendHttpClient = backendHttpClient
    }

    async getAttendance({ userId, date }) {
        const response = await this.backendHttpClient.get(BackendRouting.ATTENDANCE.ROOT, {
            params: {
                userId: userId,
                date: date,
            },
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
        await this.backendHttpClient.post(BackendRouting.ATTENDANCE.SAVE, {
            date: params.date,
            userId: params.userId,
            startTime: params.startTime,
            endTime: params.endTime,
            workplace: params.workplace,
        })
    }
}

module.exports = { AttendanceBackendGateway }