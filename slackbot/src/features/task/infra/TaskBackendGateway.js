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
      if (response.status === 200) {
        return { ok: true, data: response.data }
      }
      if (response.status === 204) {
        return { ok: true, data: undefined }
      }
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
  async createTask ({ userId, date, taskName, targetTime, memo, serial, status }) {
    console.log(`TaskBackendGateway.createTask userId:${userId}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.TASK.CREATE(),
        data: {
          userId: userId,
          serial: serial,
          date: date,
          taskName: taskName,
          targetTime: targetTime,
          memo: memo,
          status: status,
        }
      })
      console.log(`TaskBackendGateway.createTask status:${response.status}`)
      return { ok: true, data: response }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }
}

module.exports = { TaskBackendGateway }
