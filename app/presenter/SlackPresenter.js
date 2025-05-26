// Slackへのメッセージ送信を行うクラス
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
            channel: userId,
            text: msg,
            mrkdwn: true
        });
    }

    // 対象チャンネルにポストする
    async sendMessage (client, msg, channel) {
        return await client.chat.postMessage({
            channel: channel,
            text: msg,
            mrkdwn: true
        });
    }

    // スレッド内に返信する
    async sendThreadMessage (client, msg, channel, threadTs) {
        return await client.chat.postMessage({
            channel: channel,
            text: msg,
            thread_ts: threadTs,
            mrkdwn: true
        });
    }
}

exports.SlackPresenter = SlackPresenter;