// 【壁】関連のデータ加工と永続化移譲を行うクラス

// モジュール読み込み
require('date-utils');
const { ThreadModel }       = require('../model/ThreadModel');
const { PostModel }        = require('../model/PostModel');
const { NewTaskModal }   = require('../blockkit/NewTaskModal');

class ThreadService {
    constructor (postDataRepository, slackApiAdaptor) {
        this.postDataRepository = postDataRepository;
        this.slackApiAdaptor = slackApiAdaptor;
    }

    // 新規のスレッド文面を作成し投稿結果をDBに登録する
    // その後WorkReportを作成する
    async processNewThreadEntry (command) {
        // 値を取得
        let channelId = command.channel_id;
        let userId = command.user_id;
        let date = new Date().toFormat("YYYY-MM-DD");

        try {
            // timesチャンネルにスレッド作成
            let text = `<@${userId}> \n*【壁】${date}*`;
            const postResult = await this.slackApiAdaptor.sendMessage(text, channelId);
            
            // ThreadModelを作成
            let permalink = await this.slackApiAdaptor.getPermalink(channelId, postResult.ts);
            const threadModel = this.createThreadModel (channelId, date, postResult.ts, permalink);

            // 投稿情報をDBに保存
            const response = await this.postDataRepository.putItem(threadModel);

            // httpStatusCodeをチェックしてreturn
            const httpStatusCode = response.$metadata?.httpStatusCode;
            return this.checkHttpStatusCode(httpStatusCode, channelId, postResult.ts, date, 1);

        } catch (error) {
            throw new Error(
                `/makethread実行中にエラーが起きました。${error.message}`
                ,{ cause: error }
            )
        }
    }

    // スレッド内のリプライを扱う
    async processNewThreadPost (message) {
        const text = message.text;

        const postModel = this.createPostModel(message);

        await this.postDataRepository.putItem(postModel);
    }


    // ----------------------------------------------------------------------------
    // ThreadModel生成
    createThreadModel (channelId, date, threadTs, permalink) {
        const threadModel = new ThreadModel(channelId, date);

        threadModel.threadTs    = threadTs;
        threadModel.slackUrl    = permalink;
        threadModel.createdAt   = new Date().toFormat('HH24:MI:SS');

        return threadModel;
    }

    // PostModel生成
    createPostModel (channelId, date) {
        const postModel = new PostModel(channelId, date);
        return postModel;
    }

    // DynamoDBへのPut成否をhttpStatusCodeから判断してreturnを作成する
    checkHttpStatusCode (httpStatusCode, channelId, threadTs, date, serial) {
        if (httpStatusCode === 200) {
            return NewTaskModal(channelId, threadTs, date, serial);
        } else {
            throw new Error(
                `スレッド情報をDB登録時エラー。/n`
                +`httpStatusCode=${httpStatusCode}`
            )
        } 
    }
}

exports.ThreadService = ThreadService;