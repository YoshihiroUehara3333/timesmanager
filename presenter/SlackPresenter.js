// Slackへのメッセージ送信を行うクラス
//
//

class SlackPresenter {
    constructor () {
    };

    // DMを送信する
    async sendDirectMessage (client, msg, userId) {
        await client.chat.postMessage({
            channel: userId,
            text: msg
        });
    }

    // 対象チャンネルにポストする
    async sendMessage (client, msg, channel) {
        await client.chat.postMessage({
            channel: channel,
            text: msg
        });
    }

    // スレッド内に返信する
    async sendThreadMessage (client, msg, channel, threadTs) {
        await client.chat.postMessage({
            channel: channel,
            text: msg,
            thread_ts: threadTs
        });
    }
}

exports.SlackPresenter = SlackPresenter;