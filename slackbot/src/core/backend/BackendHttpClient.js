// src/core/backend/BackendHttpClient.js

const axios = require('axios')

class BackendHttpClient {
  /**
   * @param {Object} params
   * @param {string} params.baseUrl   - バックエンドAPIのベースURL（例: https://api.example.com）
   * @param {number} [params.timeoutMs=5000] - タイムアウト(ms)
   * @param {Object} [params.logger=console] - logger.info / logger.error を持つロガー
   */
  constructor ({ baseUrl, timeoutMs = 5000, logger = console }) {
    if (!baseUrl) {
      throw new Error('BackendHttpClient: baseUrl is required')
    }

    this.logger = logger

    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: timeoutMs,
    })

    this.methodSelector = {
      GET: this.get.bind(this),
      POST: this.post.bind(this),
      PUT: this.put.bind(this),
      DELETE: this.delete.bind(this),
    }
  }

  /**
   * 汎用 request
   * 呼び出し側で BackendRouting 的なオブジェクトを渡す想定
   *
   * @param {Object} params
   * @param {{ method: string, path: string }} params.routing
   * @param {any} [params.data]
   * @param {Object} [params.config]
   */
  async request ({ routing, data, config }) {
    if (!routing) {
      throw new Error('BackendHttpClient.request: routing is required')
    }
    const method = this.methodSelector[routing.method]

    return method({
      path: routing.path,
      data: data,
      config: config,
    })
  }

  /**
   * GET リクエスト
   * @param {string} path      - /api/thread など
   * @param {Object} [config]  - axios の config (params, headers など)
   * @returns {Promise<any>}   - response.data を返す
   */
  async get ({ path, config = {} }) {
    try {
      return await this.axios.get(path, config)
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
  async post ({ path, data, config = {} }) {
    try {
      return await this.axios.post(path, data, config)
    } catch (error) {
      this._logError('POST', path, error, data)
      throw this._wrapError(error)
    }
  }

  /**
   * PUT リクエスト
   * @param {string} path
   * @param {any} data         - JSON ボディ
   * @param {Object} [config]
   * @returns {Promise<any>}   - response.data を返す
   */
  async put ({ path, data, config = {} }) {
    try {
      return await this.axios.put(path, data, config)
    } catch (error) {
      this._logError('PUT', path, error, data)
      throw this._wrapError(error)
    }
  }

  async delete ({ path, config = {} }) {
    try {
      return await this.axios.delete(path, config)
    } catch (error) {
      this._logError('DELETE', path, error)
      throw this._wrapError(error)
    }
  }

  _logError (method, path, error, data) {
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

  _wrapError (error) {
    // ひとまず元の error をそのまま投げ直す
    return error
  }
}

module.exports = { BackendHttpClient }
