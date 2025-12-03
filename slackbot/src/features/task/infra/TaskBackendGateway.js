// src/features/task/infra/TaskBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')

class TaskBackendGateway {
  constructor (backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }

  /**
   *
   * @param {*} param0
   */
  async getTasks ({ userId }) {
    console.log(`TaskBackendGateway.getTasks userId:${userId}`)

    const response = await this.backendHttpClient.request({
      routing: BackendRouting.TASK.GET,
      config: {
        params: {
          userId: userId
        }
      }
    })

    console.log(`TaskBackendGateway.getTasks response:${response}`)
    return response
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
  async saveTask ({ userId, taskName, targetTime, memo, serial }) {
    const response = await this.backendHttpClient.request({
      routing: BackendRouting.TASK.SAVE,
      data: {
        userId: userId,
        taskName: taskName,
        targetTime: targetTime,
        memo: memo,
        serial: serial,
      }
    })

    console.log(`TaskBackendGateway.saveTask response:${response}`)
    return response
  }

  /**
   * 最新のタスク識別番号を発行する
   * @param {userId}ユーザID
   * @param {date}日付
   * @returns latestSerial: 最新の識別番号
   */
  async issueLatestSerial ({ userId, date }) {
    console.log(`TaskBackendGateway.getTasks userId:${userId} date:${date}`)

    const data = await this.backendHttpClient.request({
      routing: BackendRouting.TASK.SERIAL,
      config: {
        params: {
          userId: userId,
          date: date,
        }
      }
    })

    console.log(`TaskBackendGateway.issueLatestSerial response:${JSON.stringify(data)}`)
    return data.serial
  }
}

module.exports = { TaskBackendGateway }
