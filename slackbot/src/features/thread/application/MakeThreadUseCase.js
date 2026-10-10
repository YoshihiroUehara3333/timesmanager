// src/features/thread/application/MakeThreadUseCase.js

const { buildThreadInitialText, buildReplyText } = require('../blockkit/MakeThreadMessageFactory')
const { getDate } = require('../../../shared/utils/DateUtils')

const POST_FAILED = 'スレッドの投稿に失敗しました。時間をおいて再度お試しください。'
const SAVE_FAILED = 'スレッド情報の保存に失敗しました。'

class MakeThreadUseCase {
  constructor ({
    slackGateway: slack,
    threadBackendGateway: threadBackend
  }) {
    this.slack = slack
    this.threadBackend = threadBackend
  }

  /**
     * 新規スレッドを作成しポスト情報を保存する
     * @param {Object} params
     * @param {string} params.userId
     * @param {string} params.channelId
     * @param {Function} params.respond - コマンドへの返信
     */
  async execute ({ userId, channelId }) {
    console.log(`MakeThreadUseCase.execute userId:${userId} channelId:${channelId}`)

    const date = getDate('YYYY-MM-DD')
    // スレッド存在確認
    try {
      const threadResult = await this.threadBackend.getThreadByDate({ userId, date })
      if (threadResult.data) {
        return {
          ok: true,
          text: buildReplyText({ permalink: threadResult.data.permalink })
        }
      }
    } catch (error) {
      return {
        ok: false,
        text: error?.message
      }
    }

    // Slackにスレッドを投稿
    let thread = {}
    try {
      thread = await this.slack.postThread({
        channelId: channelId,
        text: buildThreadInitialText({ userId, date }),
      })
    } catch (error) {
      return {
        ok: false,
        text: POST_FAILED
      }
    }

    // バックエンドにスレッド情報を送信
    const saveResult = await this.threadBackend.saveThread({
      channelId: thread.channelId,
      threadTs: thread.threadTs,
      permalink: thread.permalink,
      userId: userId,
      date: date,
    })
    if (!saveResult.ok) {
      return {
        ok: false,
        text: SAVE_FAILED
      }
    }
    return { ok: true }
  }
}

module.exports = { MakeThreadUseCase }
