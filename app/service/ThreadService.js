// 【壁】関連のデータ加工と永続化移譲を行うクラス

// モジュール読み込み
require('date-utils');
const { ThreadModel }       = require('../model/ThreadModel');
const { PostModel }        = require('../model/PostsModel');
const { MakeThreadModal }   = require('../blockkit/MakeThreadModal');

class ThreadService {
    postDataRepository;
    
    constructor (postDataRepository) {
        this.postDataRepository = postDataRepository;
    };

    // 新規のスレッド文面を作成し投稿結果をDBに登録する
    // その後WorkReportを作成する
    async processNewThreadEntry (command, client) {
        // 値を取得
        const { user_id, channel_id } = command;
        const date = new Date().toFormat("YYYY-MM-DD"); // YYYY-MM-DD

        try {
            // timesチャンネルにスレッド作成
            const text = `<@${user_id}> \n*【壁】${date}*`;
            const postResult = await client.chat.postMessage({
                channel     : channel_id,
                text        : text,
                mrkdwn      : true,
            });
            
            // 投稿情報をDBに保存
            // スレッドの投稿URLを取得
            let { permalink } = await client.chat.getPermalink({
                channel    : postResult.channel,
                message_ts : postResult.ts,
            });

            const threadModel = this.createThreadModel (postResult, date, permalink);
            const response = await this.postDataRepository.putItem(threadModel);
            const httpStatusCode = response.$metadata?.httpStatusCode;

            if (httpStatusCode === 200) {
                return MakeThreadModal(channel_id, postResult.ts, date);
            } else {
                throw new Error(`スレッド情報をDB登録時エラー。httpStatusCode=${httpStatusCode}`, { cause: error });
            } 
        } catch (error) {
            throw new Error(`/makethread実行中にエラーが起きました。`, { cause: error });
        }
    };

    // スレッド内のリプライを扱う
    async processNewThreadReply (message, client) {
        const text = message.text;

        const postModel = this.createReplyModel(message);

        await this.postDataRepository.putItem(postModel);
    }


    // ThreadModel生成
    createThreadModel (post, date, permalink) {
        const channelId = post.channel;

        const threadModel = new ThreadModel(channelId);
        threadModel.date        = date;
        threadModel.threadTs    = post.threadTs;
        threadModel.slackUrl    = permalink;
        threadModel.createdAt   = new Date().toFormat('HH24:MI:SS');
        return threadModel;
    }

    // ReplyModel生成
    createReplyModel (message) {
        const channelId = message.channel;
        const threadTs = message.thread_ts;

        const postModel        = new PostModel(channelId, threadTs);
        return postModel;
    }
}

exports.ThreadService = ThreadService;