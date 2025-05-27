// 【壁】関連のデータ加工を行うクラス
const { ThreadModal } = require('../modals/ThreadModal');

class ThreadService {
    constructor (threadRepository) {
        this.threadRepository = threadRepository;
    };

    // 新規のスレッド文面を作成しViewを作成する
    async newThreadEntry (user_id, channel_id, client) {
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const result = await client.chat.postMessage({
            channel: channel_id,
            text: `<@${user_id}> \n*【壁】${date}*`,
            mrkdwn: true
        });

        return ThreadModal(channel_id, result.ts, date);
    };
}

exports.ThreadService = ThreadService;