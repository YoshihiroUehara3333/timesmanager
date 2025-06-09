// ControllerからSlackへのメッセージ送信を行うクラス
//
//
// chat.postMessage
// https://api.slack.com/methods/chat.postMessage
// chat.getpermalink
// 
// views.open
//

class SlackApiAdaptor {
    constructor (client) {
        this.client = client;
    }

    // DMを送信する
    async sendDirectMessage (msg, userId) {
        return await this.client.chat.postMessage({
            channel   : userId,
            text      : msg,
            mrkdwn    : true
        });
    }

    // 対象チャンネルにポストする
    async sendMessage (msg, channel) {
        return await this.client.chat.postMessage({
            channel   : channel,
            text      : msg,
            mrkdwn    : true
        });
    }

    // 対象チャンネルにポストする
    async sendBlockMessage (text, channelId, threadTs, blocks) {
        return await this.client.chat.postMessage({
            channel   : channelId,
            thread_ts : threadTs,
            text      : text,
            mrkdwn    : true,
            blocks    : blocks
        });
    }

    // スレッド内に返信する
    async sendThreadMessage (msg, channel, threadTs) {
        return await this.client.chat.postMessage({
            channel   : channel,
            text      : msg,
            thread_ts : threadTs,
            mrkdwn    : true
        });
    }

    // モーダルを開く
    async openView (view, triggerId) {
        return await this.client.views.open({
                trigger_id : triggerId,
                view       : view,
        })
    }

    // Slack投稿のURLを取得する
    async getPermalink(channelId, messageTs) {
        const getResult = await this.client.chat.getPermalink({
            channel    : channelId,
            message_ts : messageTs
        })

        return getResult.permalink;
    }
}

exports.SlackApiAdaptor = SlackApiAdaptor;