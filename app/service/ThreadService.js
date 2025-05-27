// 【壁】関連のデータ加工を行うクラス
const { ThreadModel } = require('../model/ThreadModel');

class ThreadService {
    constructor (threadRepository) {
        this.threadRepository = threadRepository;
    };

    // 新規のスレッド文面を作成しDBに登録する
    async newThreadEntry (user_id, channel_id, date, client) {
        const text = `<@${user_id}> \n*【壁】${date}*`;
        const result = await client.chat.postMessage({
            channel: channel_id,
            text: text,
            mrkdwn: true,
        });
        
        // スレッドの投稿URLを取得
        let { permalink } = await client.chat.getPermalink({
            channel: result.channel,
            message_ts: result.ts
        });
        const threadModel = this.createThreadModel (result.message, date, permalink);
        return await this.threadRepository.putNewThread(threadModel);
    };


    // スレッド内のリプライをDBに保存する
    async newThreadReply (message, logger, client) {
        const text = message.text;

        await this.threadRepository.putNewReply(threadModel);
    }

    // ThreadModel生成
    createThreadModel (message, date, permalink) {
        const threadModel = new ThreadModel();
        threadModel.date = date;
        threadModel.userId = message.user;
        threadModel.channel = message.channel;
        threadModel.threadTs = message.ts;
        threadModel.slackUrl = permalink;
        return threadModel;
    }
}

exports.ThreadService = ThreadService;