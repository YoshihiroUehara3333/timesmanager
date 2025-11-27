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
   * @returns result.exists = レコードが存在した場合true
   */
  async checkIsAlreadyExecuted ({ userId, date }) {
    const url = `${process.env.BACKEND_API_BASE_URL}${BackendRouting.THREAD.ROOT}`
    const response = await axios.get(url, {
      params: {
        userId: userId,
        date: date,
      },
    })

    if (response.data[0]) {
      return {
        exists: true,
        permalink: response.data[0].permalink,
        threadTs: response.data[0].threadTs,
      }
    } else {
      return {
        exists: false,
      }
    }
  }
}

exports.ThreadService = ThreadService
