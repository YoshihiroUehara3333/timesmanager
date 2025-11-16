// 【壁】関連のデータ加工と永続化移譲を行うクラス

// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { PostMessage, GetPermalink } = require('../slack/SlackApiRequest')

class ThreadService {
  constructor ({
    slackApiAdaptor
  }) {
    this.slackApiAdaptor = slackApiAdaptor
  }

  // 新規のスレッド文面を作成し投稿結果をDBに保存する
  async createNewThread (command) {
    // 値を取得
    const channelId = command.channel_id
    const userId = command.user_id
    const date = new Date().toFormat('YYYY-MM-DD')

    try {
      // timesチャンネルにスレッド作成
      const text = `<@${userId}> \n*【壁】${date}*`
      const postResult = await this.slackApiAdaptor.send(new PostMessage(
        channelId,
        text
      ))
      const permalink = await this.slackApiAdaptor.send(new GetPermalink(
        channelId,
        postResult.ts
      ))

      // Spring BootにPOST
      const response = await axios.post('https://dev.slack-times-manager.com/api/thread', {
        channelId,
        date,
        threadTs: postResult.ts,
        permalink
      })

      if (response.status === 200) {
        return postResult
      } else {
        throw new Error(
          'スレッド情報をDB登録時エラー。/n' +
                    `httpStatusCode=${httpStatusCode}`
        )
      }
    } catch (error) {
      throw new Error(
                `/makethread実行中にエラーが起きました。${error.message}`
                , { cause: error }
      )
    }
  }
}

exports.ThreadService = ThreadService
