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
    let threadResult
    try {
      threadResult = await this.threadBackendGateway.getThreadByDate({ userId, date })
      if (threadResult.data) {
        await respond(buildReplyText({ permalink: threadResult.data.permalink }))
        return { ok: true }
      }
    } catch (error) {
      await respond(error?.message)
      return { ok: false }
    }

    // Slackにスレッドを投稿
    let thread
    try {
      thread = await this.slackGateway.postThread({
        channelId: channelId,
        text: buildThreadInitialText({ userId, date }),
      })
    } catch (error) {
      await respond('スレッドの投稿に失敗しました。時間をおいて再度お試しください。')
      return { ok: false }
    }

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
      return { ok: false }
    }
    return { ok: true }
  }
}

module.exports = { MakeThreadUseCase }
