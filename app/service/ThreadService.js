// 【壁】関連のデータ加工を行うクラス

class ThreadService {
    constructor (threadRepository) {
        this.threadRepository = threadRepository;
    };

    // 新規の【壁】のポスト情報をDBに保存する
    async newThreadEntry (message, client) {
        const text = message.text;

        // 投稿URLを取得
        var result = await client.chat.getPermalink({
            channel: message.channel,
            message_ts: message.ts
        });

        // 下記カラムをDBに保存する
        // partition_key
        // thread_ts
        // date
        // slack_url

        return '';
    };
}

exports.ThreadService = ThreadService;