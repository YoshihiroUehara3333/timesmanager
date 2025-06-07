// モジュール読み込み
require('date-utils');
const { DiaryUtils } = require('../utility/DiaryUtils');
const { DiaryModel } = require('../model/DiaryModel');
const { DBConst } = require('../constants/DBConst');

class DiaryService {
    postDataRepository;
    feedbackGenerator;

    constructor(postDataRepository, feedbackGenerator) {
        this.postDataRepository = postDataRepository;
        this.feedbackGenerator = feedbackGenerator;
    };

    /*
    **   thread_tsを基にフィードバックを生成する
    */
    async generateFeedback(message){
        const threadTs = message.thread_ts;
        const channelId = message.channel;

        // DBから業務日誌情報を取得
        try {
            const prefix = DBConst.SORT_KEY_PREFIX.DIARY;
            const queryResult = await this.postDataRepository.queryByThreadTsAndSortKeyPrefix(threadTs, prefix);
            if (queryResult == null) return `DBから日報データを取得できませんでした。`;
            
            const filteredResult = queryResult.Items.filter(item => item.partition_key === channelId);
            if (filteredResult.length === 0) return `指定チャンネルのデータが見つかりませんでした。`;

            // たいていは1件のみ想定
            const diary = filteredResult[0];
            return await this.feedbackGenerator.generateFeedback(diary);
            
        } catch (error) {
            throw new Error(`フィードバック生成中にエラーが発生しました。${error.message}`, { cause: error });
        }
    };

    /*
    **   日記新規登録処理
    */
    async processNewDiaryEntry (message, client) {
        const channelId = message.channel;

        // 投稿URLを取得
        let { permalink } = await client.chat.getPermalink({
            channel    : channelId,
            message_ts : message.ts
        });

        // diaryModelを作成
        const diaryModel = this.createDiaryModel(message, channelId, permalink);
        diaryModel.postedAt = new Date().toFormat('HH24:MI:SS');

        // DB新規重複チェック
        const date = diaryModel.date;
        try {
            const result = await this.postDataRepository.getDiaryByDate(channelId, date);
            if (result) return `日付が重複しています。(${date})`;

            const response = await this.postDataRepository.putItem(diaryModel);
            const httpStatusCode = response?.$metadata.httpStatusCode;
            if (httpStatusCode == 200) {
                return `日記(${date})のDB登録に成功しました。`;
            } else {
                throw new Error(`日記(${date})のDB登録に失敗しました。httpStatusCode=${httpStatusCode}`, { cause: error });
            }

        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    }

    /*
    **   日記編集処理
    */
    async processUpdateDiary (message, channelId) {
        console.log(`channelId:${channelId}`);
        const diaryModel = this.createDiaryModel(message, channelId, '');
        diaryModel.postedAt = new Date().toFormat('HH24:MI:SS');

        // DB更新
        const date = diaryModel.date;
        try {
            const partitionKey = diaryModel.partitionKey;
            const getResult = await this.postDataRepository.getDiaryByDate(partitionKey, date);
            if (getResult.slack_url) {
                diaryModel.slackUrl = getResult.slack_url;
            }

            const response = await this.postDataRepository.putItem(diaryModel);
            const httpStatusCode = response?.$metadata.httpStatusCode;
            if (httpStatusCode == 200) {
                return `日記(${date})のDB更新に成功しました。`;
            } else {
                throw new Error(`日記(${date})のDB登録に失敗しました。httpStatusCode=${httpStatusCode}`, { cause: error });
            }
        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    };


    // DiaryModel生成処理
    createDiaryModel (message, channelId, permalink) {
        const text = message.text;

        const diaryModel = new DiaryModel(channelId);
        diaryModel.date                = DiaryUtils.parseDate(text);
        diaryModel.workingPlaceCd      = DiaryUtils.parseWorkingPlaceCd(text);
        diaryModel.content             = DiaryUtils.parseContent(text);
        diaryModel.threadTs            = message.ts;
        diaryModel.slackUrl            = permalink;

        return diaryModel;
    }
}

exports.DiaryService = DiaryService;