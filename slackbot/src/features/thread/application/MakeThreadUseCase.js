// src/features/thread/application/MakeThreadUseCase.js

const { buildThreadInitialText, buildReplyText } = require('../blockkit/MakeThreadMessageFactory')
const { getDate } = require('../../../shared/utils/DateUtils')

class MakeThreadUseCase {
    constructor({ slackGateway, threadBackendGateway }) {
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
    async execute({ userId, channelId, respond }) {
        console.log(`HomeOpenUseCase.excecute userId:${userId} channelId:${channelId}`)

        const date = getDate('YYYY-MM-DD')

        // スレッド存在確認
        let thread = await this.threadBackendGateway.getThread({ userId, date });
        if (!thread) {
            // スレッド用メッセージ本文を作る
            const threadText = buildThreadInitialText({ userId, text })

            // Slackにスレッドを投稿
            thread = await this.slackGateway.postThread({
                channelId: channelId,
                text: threadText,
            })

            // バックエンドにスレッド情報を保存
            await this.threadBackendGateway.saveThread({
                channelId: thread.channelId,
                threadTs: thread.threadTs,
                permalink: thread.permalink,
                userId: userId,
            })
        }

        // /makethread のコマンドに返信
        const replyText = buildReplyText({ permalink: thread.permalink })
        await respond(replyText)
    }
}

module.exports = { MakeThreadUseCase }