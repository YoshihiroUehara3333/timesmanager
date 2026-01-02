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
   * @returns {Object} return
   * @returns {boolean} return.ok
   * @returns {string} return.status
   * @returns {object} return.data
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

      console.log(`ThreadBackendGateway.saveThread status:${JSON.stringify(response.status)}`)
      if (response.status === 201) {
        return { ok: true, status: response.status, data: response.data }
      }
    } catch (err) {
      const status = err?.response?.status
      if (status === 409) {
        return { ok: false, errorType: 'CONFLICT', error: err }
      }

      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, errorType: 'OTHER', error: err }
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
      console.log(`ThreadBackendGateway.getThreadByDate status:${JSON.stringify(response.status)}`)
      if (response.status === 200) {
        return { ok: true, status: response.status, data: response.data }
      } else {
        return { ok: true, status: response.status, data: undefined }
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
      console.log(`ThreadBackendGateway.getAllThread status:${JSON.stringify(response.status)}`)
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
