// src/core/slack/SlackApiAdaptor.js

class SlackApiAdaptor {
    constructor(client) {
        this.client = client
    }

    // chat.postMessage
    // https://api.slack.com/methods/chat.postMessage
    async postMessage({channelId, text, threadTs, blocks}) {
        try {
            return await this.client.chat.postMessage({
                channel: channelId,
                text: text,
                thread_ts: threadTs,
                blocks: blocks,
            })
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    // chat.getpermalink
    // https://api.slack.com/methods/chat.getpermalink
    async getPermalink({channelId, messageTs}) {
        try {
            const getResult = await this.client.chat.getPermalink({
                channel: channelId,
                message_ts: messageTs,
            })
            return getResult.permalink
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    // views.open
    // https://api.slack.com/methods/views.open
    async viewsOpen({triggerId, view}) {
        try {
            return await this.client.views.open({
                trigger_id: triggerId,
                view: view,
            })
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }

    // views.publish
    // https://api.slack.com/methods/views.publish
    async viewsPublish({userId, view}) {
        try {
            return await this.client.views.publish({
                user_id: userId,
                view: view,
            })
        } catch (error) {
            throw new Error(error.message, { cause: error })
        }
    }
}

exports.SlackApiAdaptor = SlackApiAdaptor