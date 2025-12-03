// src/features/thread/infra/ThreadBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')
const { BackendGatewayBase } = require('../../../core/backend/BackendGatewayBase')

class ThreadBackendGateway extends BackendGatewayBase {
  /**
   * 
   * @param {*} param0 
   */
  async saveThread({ channelId, threadTs, permalink, userId }) {
    const response = await this.backendHttpClient.request({
      routing: BackendRouting.THREAD.SAVE,
      data: {
        channelId: channelId,
        threadTs: threadTs,
        permalink: permalink,
        userId: userId,
      }
    })

    console.log(JSON.stringify(response))
  }

  /**
   * 
   * @param {*} param0 
   * @returns 
   */
  async getThread({ userId, date }) {
    console.log(`ThreadBackendGateway.getThread userId:${userId} date:${date}`)

    const response = await this.backendHttpClient.request({
      routing: BackendRouting.THREAD.GET,
      config: {
        params: {
            userId: userId,
            date: date,
        }
      }
    })

    console.log(`response:${JSON.stringify(response)}`)
    if (response[0]) {
      return {
        channelId: response[0].channelId,
        permalink: response[0].permalink,
        threadTs: response[0].threadTs,
      }
    } else {
      return undefined
    }
  }
}

module.exports = { ThreadBackendGateway }