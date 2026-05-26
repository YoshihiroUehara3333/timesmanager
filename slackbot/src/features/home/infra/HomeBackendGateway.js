// src/features/home/infra/HomeBackendGateway.js

const { BackendRouting } = require('../../../shared/constants/BackendRouting')

class HomeBackendGateway {
  constructor (backendHttpClient) {
    this.backendHttpClient = backendHttpClient
  }

  /**
   *
   * @param {string} userId - ユーザID
   * @returns {object}
   */
  async getForHome ({ userId, date }) {
    console.log(`HomeBackendGateway.getForHome userId:${userId} date:${date}`)
    try {
      const response = await this.backendHttpClient.request({
        routing: BackendRouting.HOME.GET(),
        config: {
          params: {
            userId: userId,
            date: date
          }
        }
      })
      console.log(`HomeBackendGateway.getForHome status:${response.status}`)
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
}

module.exports = { HomeBackendGateway }
