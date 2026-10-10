// src/features/home/infra/HomeBackendGateway.js
const { logger } = require('../../../core/logging/Logger')

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
    logger.info('HomeBackendGateway.getForHome', {
      userId: userId,
      date: date
    })
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
      logger.info('HomeBackendGateway.getForHome', {
        response: response
      })
      switch (response.status) {
        case 200:
          return { ok: true, data: response.data }
        case 204:
          return { ok: true, data: undefined }
        default:
          return {
            ok: false,
            error: new Error(`Unexpected HTTP status: ${response.status}`)
          }
      }
    } catch (err) {
      console.warn(`backendHttpClient.request failed msg=${err?.message}`)
      return { ok: false, error: err }
    }
  }
}

module.exports = { HomeBackendGateway }
