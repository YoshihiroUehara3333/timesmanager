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
  }

  /**
   * 
   * @param {*} param0 
   * @returns 
   */
  async getThread({ userId, date }) {
    const response = await this.backendHttpClient.request({
      routing: BackendRouting.THREAD.GET,
      config: {
        params: {
            userId: userId,
            date: date,
        }
      }
    })

    if (response.data[0]) {
      return {
        channelId: response.data[0].channelId,
        permalink: response.data[0].permalink,
        threadTs: response.data[0].threadTs,
      }
    } else {
      return null
    }
  }
}

module.exports = { ThreadBackendGateway }