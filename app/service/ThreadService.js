// 【壁】関連のデータ加工を行うクラス
const { MakeThreadModal } = require('../modals/MakeThreadModal');

class ThreadService {
    constructor (threadRepository) {
        this.threadRepository = threadRepository;
    };

    // 新規のスレッド文面を作成しDBに登録する
    async newThreadEntry (user_id, channel_id, client) {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const text = `<@${user_id}> \n*【壁】${date}*`;

        const result = await client.chat.postMessage({
            channel: channel_id,
            text: text,
            mrkdwn: true,
        });

        this.threadRepository.putNewThread();

        return MakeThreadModal(channel_id, result.ts, date);
    };


    // スレッド内のリプライをDBに保存する
    async newThreadReply (message, logger, client) {
        const text = message.text;

        this.threadRepository.put;
    }
}

exports.ThreadService = ThreadService;