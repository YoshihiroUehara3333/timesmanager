// src/features/thread/infra/ThreadBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')
const { BackendGatewayBase } = require('../../../core/backend/BackendGatewayBase')

class ThreadBackendGateway extends BackendGatewayBase {
  /**
   * 
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.channelId
   * @param {string} params.permalink
   * @param {string} params.threadTs
   */
  async saveThread({ channelId, threadTs, permalink, userId }) {
    console.log(`ThreadBackendGateway.saveThread channelId:${channelId} threadTs:${threadTs} permalink:${permalink} userId:${userId}`)

    const response = await this.backendHttpClient.request({
      routing: BackendRouting.THREAD.SAVE,
      data: {
        channelId: channelId,
        threadTs: threadTs,
        permalink: permalink,
        userId: userId,
      }
    })

    console.log(`ThreadBackendGateway.saveThread response:${JSON.stringify(response)}`)
    return response
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