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
    async sendBlockMessage (msg, channel, thread_ts, blocks) {
        return await this.client.chat.postMessage({
            channel   : channel,
            thread_ts : thread_ts,
            text      : msg,
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
    async 
}

exports.SlackApiAdaptor = SlackApiAdaptor;