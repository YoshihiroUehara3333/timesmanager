// src/features/task/infra/TaskBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')

class TaskBackendGateway {
  constructor(backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }

  async getTasks({ userId }){
    await this.backendHttpClient.request({
      routing: BackendRouting.TASK.GET,
      config: {
        params: {
          userId: userId
        }
      }
    })
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
    await this.backendHttpClient.request({
      routing: BackendRouting.TASK.SAVE,
      data: {
        userId: userId,
        taskName: taskName,
        targetTime: targetTime,
        memo: memo,
        serial: serial,
      }
    })
  }

  /**
   * 最新のタスク識別番号を発行する
   * @param {userId}ユーザID
   * @param {date}日付
   * @returns latestSerial: 最新の識別番号
   */
  async issueLatestSerial({ userId, date }) {
    const data = await this.backendHttpClient.request({
      routing: BackendRouting.TASK.SERIAL, 
      config: {
        params: {
          userId: userId,
          date: date,
        }
      }
    })

    console.log(`issueLatestSerial response:${data[0]}`)
    return data[0].serial
  }
}

module.exports = { TaskBackendGateway }