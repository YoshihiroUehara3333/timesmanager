// src/features/thread/application/MakeThreadUseCase.js

const { logger } = require('../../../core/logging/Logger')

const { buildThreadInitialText, buildReplyText } = require('../blockkit/MakeThreadMessageFactory')
const { getDate } = require('../../../shared/utils/DateUtils')

const { ThreadSlackGateway } = require('../infra/ThreadSlackGateway')
const { ThreadBackendGateway } = require('../infra/ThreadBackendGateway')

const POST_FAILED = 'スレッドの投稿に失敗しました。時間をおいて再度お試しください。'
const SAVE_FAILED = 'スレッド情報の保存に失敗しました。'

class MakeThreadUseCase {
  constructor ({
    slackApiAdaptor,
    backendHttpClient
  }) {
    this.slack = new ThreadSlackGateway(slackApiAdaptor)
    this.threadBackend = new ThreadBackendGateway(backendHttpClient)
  }

  /**
     * 新規スレッドを作成しポスト情報を保存する
     * @param {Object} params
     * @param {string} params.userId
     * @param {string} params.channelId
     * @param {Function} params.respond - コマンドへの返信
     */
  async execute ({ userId, channelId }) {
    logger.info('MakeThread.execute', {
      userId: userId,
      channelId: channelId
    })

    const date = getDate('YYYY-MM-DD')
    // スレッド存在確認
    const lookupResult = await this.lookup({ userId, date })
    if (!lookupResult.ok) {
      return lookupResult
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
    const saveResult = await this.save({ thread, userId, date })
    if (!saveResult.ok) {
      return {
        ok: false,
        text: SAVE_FAILED
      }
    }
    return { ok: true }
  }

  async lookup ({ userId, date }) {
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
  }

  async save ({ thread, userId, date }) {
    return await this.threadBackend.saveThread({
      channelId: thread.channelId,
      threadTs: thread.threadTs,
      permalink: thread.permalink,
      userId: userId,
      date: date
    })
  }
}

module.exports = { MakeThreadUseCase }
