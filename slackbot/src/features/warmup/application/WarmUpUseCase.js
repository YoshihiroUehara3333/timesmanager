// src/features/warmup/application/WarmUpUseCase.js

const { buildReplyText } = require('../blockkit/WarmUpMessageFactory')

class WarmUpUseCase {
    constructor({ slackGateway }) {
        this.slackGateway = slackGateway
    }

    /**
     * @param {Function} params.respond - コマンドへの返信
     */
    async execute({ userId, respond }) {
        const replyText = buildReplyText({})
        await respond(replyText)
    }
}

module.exports = { WarmUpUseCase }