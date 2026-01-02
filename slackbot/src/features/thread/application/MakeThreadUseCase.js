// src/features/thread/application/MakeThreadUseCase.js

const { buildThreadInitialText, buildReplyText } = require('../blockkit/MakeThreadMessageFactory')
const { getDate } = require('../../../shared/utils/DateUtils')

class MakeThreadUseCase {
  constructor ({ slackGateway, threadBackendGateway }) {
    this.slackGateway = slackGateway
    this.threadBackendGateway = threadBackendGateway
  }

  /**
     * 新規スレッドを作成しポスト情報を保存する
     * @param {Object} params
     * @param {string} params.userId
     * @param {string} params.channelId
     * @param {Function} params.respond - コマンドへの返信
     */
  async execute ({ userId, channelId, respond }) {
    console.log(`MakeThreadUseCase.execute userId:${userId} channelId:${channelId}`)

    const date = getDate('YYYY-MM-DD')

    // スレッド存在確認
    const threadResult = await this.threadBackendGateway.getThreadByDate({ userId, date })
    if (!threadResult.ok) {
      await respond('スレッド情報の取得に失敗しました。時間をおいて再度お試しください。')
      return { ok: false }
    }

    if (threadResult.data) {
      // /makethread のコマンドに返信
      const replyText = buildReplyText({ permalink: threadResult.data.permalink })
      await respond(replyText)
      return { ok: true }
    }

    // スレッド用メッセージ本文を作る
    const threadText = buildThreadInitialText({ userId, date })
    // Slackにスレッドを投稿
    const thread = await this.slackGateway.postThread({
      channelId: channelId,
      text: threadText,
    })

    // バックエンドにスレッド情報を送信
    const saveResult = await this.threadBackendGateway.saveThread({
      channelId: thread.channelId,
      threadTs: thread.threadTs,
      permalink: thread.permalink,
      userId: userId,
      date: date,
    })
    if (!saveResult.ok) {
      await respond('スレッド情報の保存に失敗しました。')
    }
    return { ok: saveResult.ok }
  }
}

module.exports = { MakeThreadUseCase }
