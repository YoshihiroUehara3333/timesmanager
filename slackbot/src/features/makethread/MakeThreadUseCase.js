const { buildThreadInitialText, buildReplyText } = require('./MakeThreadMessageFactory.')

class MakeThreadUseCase {
    constructor({ slackGateway, backendGateway }) {
        this.slackGateway = slackGateway
        this.backendGateway = backendGateway
    }

    /**
     * @param {Object} params
     * @param {string} params.userId
     * @param {string} params.channelId
     * @param {string} params.text      - /makethread の後ろに書かれたオプションテキストなど
     * @param {Function} params.respond - コマンドへの返信
     */
    async execute({ userId, channelId, text, respond }) {
        // スレッド存在確認
        let thread = await this.backendGateway.getThread({ userId, date });

        if (!thread) {
            // スレッド用メッセージ本文を作る
            const threadText = buildThreadInitialText({ userId, text })

            // Slackにスレッドを投稿
            thread = await this.slackGateway.postThread({
                channelId: channelId,
                text: threadText,
            })

            // バックエンドにスレッド情報を保存
            await this.backendGateway.saveThread({
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