// src/features/thread/infra/ThreadBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')
const { BackendGatewayBase } = require('../../../core/backend/BackendGatewayBase')

class ThreadBackendGateway extends BackendGatewayBase {
  /**
   * スレッド情報をバックエンドにPOST送信する
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.channelId
   * @param {string} params.permalink
   * @param {string} params.threadTs
   */
  async saveThread ({ channelId, threadTs, permalink, userId, date }) {
    console.log(`ThreadBackendGateway.saveThread\nchannelId:${channelId} threadTs:${threadTs} permalink:${permalink} userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.THREAD.CREATE(),
        data: {
          channelId: channelId,
          threadTs: threadTs,
          permalink: permalink,
          userId: userId,
          date: date,
        }
      })
      console.log(`ThreadBackendGateway.saveThread response:${JSON.stringify(response)}`)
      return { ok: true, data: response.data }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }

  /**
   * 日付をパラメータとしてバックエンドにGET送信する
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.date
   * @returns
   */
  async getThreadByDate ({ userId, date }) {
    console.log(`ThreadBackendGateway.getThreadByDate userId:${userId} date:${date}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.THREAD.GETBYDATE(date),
        config: {
          params: {
            userId: userId
          }
        }
      })
      console.log(`ThreadBackendGateway.getThreadByDate response:${JSON.stringify(response)}`)
      if (response.status === 200) {
        return { ok: true, data: response.data }
      } else {
        return { ok: true, data: undefined }
      }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  async getAllThread ({ userId }) {
    console.log(`ThreadBackendGateway.getAllThread userId:${userId}`)

    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.THREAD.GETALL(),
        config: {
          params: {
            userId: userId
          }
        }
      })
      console.log(`ThreadBackendGateway.getAllThread response:${JSON.stringify(response)}`)
      if (response.status === 200) {
        return { ok: true, data: response.data }
      } else {
        return { ok: true, data: undefined }
      }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }
}

module.exports = { ThreadBackendGateway }
