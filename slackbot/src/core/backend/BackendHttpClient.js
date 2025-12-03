// src/core/backend/BackendHttpClient.js
const axios = require('axios')

class BackendHttpClient {
  /**
   * @param {Object} params
   * @param {string} params.baseUrl   - バックエンドAPIのベースURL（例: https://api.example.com）
   * @param {number} [params.timeoutMs=5000] - タイムアウト(ms)
   * @param {Object} [params.logger=console] - logger.info / logger.error を持つロガー
   */
  constructor({ baseUrl, timeoutMs = 5000, logger = console }) {
    if (!baseUrl) {
      throw new Error('BackendHttpClient: baseUrl is required')
    }

    this.logger = logger

    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: timeoutMs,
    })
  }

  /**
   * GET リクエスト
   * @param {string} path      - /api/thread など
   * @param {Object} [config]  - axios の config (params, headers など)
   * @returns {Promise<any>}   - response.data を返す
   */
  async get(path, config = {}) {
    try {
      const res = await this.axios.get(path, config)
      return res.data
    } catch (error) {
      this._logError('GET', path, error)
      throw this._wrapError(error)
    }
  }

  /**
   * POST リクエスト
   * @param {string} path
   * @param {any} data         - JSON ボディ
   * @param {Object} [config]
   * @returns {Promise<any>}   - response.data を返す
   */
  async post(path, data, config = {}) {
    try {
      const res = await this.axios.post(path, data, config)
      return res.data
    } catch (error) {
      this._logError('POST', path, error, data)
      throw this._wrapError(error)
    }
  }

  async put(path, data, config = {}) {
    try {
      const res = await this.axios.put(path, data, config)
      return res.data
    } catch (error) {
      this._logError('PUT', path, error, data)
      throw this._wrapError(error)
    }
  }

  async delete(path, config = {}) {
    try {
      const res = await this.axios.delete(path, config)
      return res.data
    } catch (error) {
      this._logError('DELETE', path, error)
      throw this._wrapError(error)
    }
  }

  _logError(method, path, error, data) {
    const status = error.response?.status
    const msg = error.message
    this.logger.error(
      `[BackendHttpClient] ${method} ${path} failed. status=${status}, message=${msg}`,
      {
        path,
        method,
        status,
        data,
        responseData: error.response?.data,
      }
    )
  }

  _wrapError(error) {
    // ひとまず元の error をそのまま投げ直す
    return error
  }
}

module.exports = { BackendHttpClient }
