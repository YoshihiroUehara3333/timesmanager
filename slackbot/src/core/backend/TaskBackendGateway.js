// src/core/backend/TaskBackendGateway.js

const { BackendRouting } = require('../../constants/BackendRouting')

class TaskBackendGateway {
  constructor(backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }
  
  /**
   * 最新のタスク識別番号を発行する
   * @param {userId}ユーザID
   * @param {date}日付
   * @returns latestSerial: 最新の識別番号
   */
  async issueLatestSerial ({ userId, date }) {
    const url = `${process.env.BACKEND_API_BASE_URL}${BackendRouting.TASK.SERIAL}`
    const response = await axios.get(url, {
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