// src/features/task/infra/TaskBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')

class TaskBackendGateway {
  constructor (backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }

  /**
   *
   * @param {string} userId - ユーザID
   * @returns {object}
   */
  async getAllTasks ({ userId }) {
    console.log(`TaskBackendGateway.getTasks userId:${userId}`)
    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.TASK.GETALL(),
        config: {
          params: {
            userId: userId
          }
        }
      })
      console.log(`TaskBackendGateway.getAllTasks status:${response.status}`)
      return { ok: true, data: response.data }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }

  /**
   *
   * @param {string} userId - ユーザID
   * @param {string} taskName
   * @param {string} targetTime
   * @param {string} memo
   * @param {string} serial
   * @returns
   */
  async createTask ({ userId, taskName, targetTime, memo, serial }) {
    console.log(`TaskBackendGateway.createTask userId:${userId}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.TASK.CREATE(),
        data: {
          userId: userId,
          taskName: taskName,
          targetTime: targetTime,
          memo: memo,
          serial: serial,
        }
      })
      console.log(`TaskBackendGateway.saveTask status:${response.status}`)
      return { ok: true, data: response }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }

  /**
   * 最新のタスク識別番号を発行する
   * @param {userId}ユーザID
   * @param {date}日付
   * @returns latestSerial: 最新の識別番号
   */
  async issueLatestSerial ({ userId, date }) {
    console.log(`TaskBackendGateway.getTasks userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.TASK.SERIAL,
        config: {
          params: {
            userId: userId,
            date: date,
          }
        }
      })
      console.log(`TaskBackendGateway.issueLatestSerial status:${response.status}`)
      return { ok: true, data: response.data }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }
}

module.exports = { TaskBackendGateway }
