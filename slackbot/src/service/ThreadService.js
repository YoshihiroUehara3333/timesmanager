// 【壁】関連のデータ加工と永続化移譲を行うクラス

// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { BackendRouting } = require('../constants/BackendRouting')

class ThreadService {
  constructor ({
    slackApiAdaptor
  }) {
    this.slackApiAdaptor = slackApiAdaptor
  }

  /**
   * 指定された日付とユーザIDで既にスレッドが作られているか確認する
   * @param {*} userId
   * @param {*} date
   * @returns checkResult
   */
  async checkIsAlreadyExecuted ({ userId, date }) {
    const url = `${process.env.BACKEND_API_BASE_URL}${BackendRouting.THREAD.ROOT}`
    const getParams = `?userId=${userId}&date=${date}`
    const response = await axios.get(url + getParams)

    if (response.data[0]) {
      return {
        permalink: response.data[0].permalink,
      }
    }
  }
}

exports.ThreadService = ThreadService
