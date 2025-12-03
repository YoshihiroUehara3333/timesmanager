// src/core/backend/TaskBackendGateway.js

const { BackendRouting } = require('../../constants/BackendRouting')

class TaskBackendGateway {
  constructor(backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }

  /**
   * 
   * @param {userId}ユーザID
   * @param {taskName}
   * @param {targetTime}
   * @param {memo}
   * @param {serial}
   * @returns 
   */
  async saveTask({ userId, taskName, targetTime, memo, serial }) {
    await this.backendHttpClient.post(BackendRouting.TASK.SAVE, {
      userId: userId,
      taskName: taskName,
      targetTime: targetTime,
      memo: memo,
      serial: serial,
    })
  }

  /**
   * 最新のタスク識別番号を発行する
   * @param {userId}ユーザID
   * @param {date}日付
   * @returns latestSerial: 最新の識別番号
   */
  async issueLatestSerial({ userId, date }) {
    const response = await this.backendHttpClient.get(BackendRouting.TASK.SERIAL, {
      params: {
        userId: userId,
        date: date,
      }
    })
    console.log(`issueLatestSerial response:${response}`)
    return response.data[0].serial
  }
}

module.exports = { TaskBackendGateway }