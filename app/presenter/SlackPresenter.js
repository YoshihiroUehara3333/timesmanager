// ControllerからSlackへのメッセージ送信を行うクラス
//
//
// chat.postMessage
// https://api.slack.com/methods/chat.postMessage

class SlackPresenter {
    constructor () {
    };

    // DMを送信する
    async sendDirectMessage (client, msg, userId) {
        return await client.chat.postMessage({
            channel   : userId,
            text      : msg,
            mrkdwn    : true
        });
    }

    // 対象チャンネルにポストする
    async sendMessage (client, msg, channel) {
        return await client.chat.postMessage({
            channel   : channel,
            text      : msg,
            mrkdwn    : true
        });
    }

    // 対象チャンネルにポストする
    async sendBlockMessage (client, msg, channel, thread_ts, blocks) {
        return await client.chat.postMessage({
            channel   : channel,
            thread_ts : thread_ts,
            text      : msg,
            mrkdwn    : true,
            blocks    : blocks
        });
    }

    // スレッド内に返信する
    async sendThreadMessage (client, msg, channel, threadTs) {
        return await client.chat.postMessage({
            channel   : channel,
            text      : msg,
            thread_ts : threadTs,
            mrkdwn    : true
        });
    }

    // モーダルを開く
    async openView (client, view, triggerId) {
        return await client.views.open({
                trigger_id : triggerId,
                view       : view,
        })
    }
}

exports.SlackPresenter = SlackPresenter;