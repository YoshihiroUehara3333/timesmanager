// モジュール読み込み
require('date-utils');
const { DiaryUtils } = require('../utility/DiaryUtils');
const { DiaryModel } = require('../model/DiaryModel');
const { POSTDATA }   = require('../constants/DynamoDB/PostData');

class DiaryService {
    constructor(postDataRepository, openAiApiAdaptor, slackApiAdaptor) {
        this.postDataRepository = postDataRepository;
        this.openAiApiAdaptor = openAiApiAdaptor;
        this.slackApiAdaptor = slackApiAdaptor;
    }

    /*
    **   thread_tsを基にフィードバックを生成する
    */
    async generateFeedback(message){
        // messageから値を取得
        const threadTs = message.thread_ts;
        const channelId = message.channel;

        // DBから業務日誌情報を取得
        try {
            const prefix = POSTDATA.SORT_KEY_PREFIX.DIARY;
            const queryResult = await this.postDataRepository.queryByThreadTsAndSortKeyPrefix(threadTs, prefix);
            if (queryResult == null) return `DBから日報データを取得できませんでした。`;
            
            const filteredResult = queryResult.Items.filter(item => item.partition_key === channelId);
            if (filteredResult.length === 0) return `指定チャンネルのデータが見つかりませんでした。`;

            // たいていは1件のみ想定
            const diary = filteredResult[0];
            return await this.openAiApiAdaptor.generateFeedback(diary);
            
        } catch (error) {
            throw new Error(`フィードバック生成中にエラーが発生しました。${error.message}`, { cause: error });
        }
    };

    /*
    **   日記新規登録処理
    */
    async processNewDiaryEntry (message) {
        // messageから値を取得
        let channelId = message.channel;
        let threadTs = message.ts;
        
        // 投稿URLを取得
        let permalink = await this.slackApiAdaptor.getPermalink(channelId, threadTs);

        // diaryModelを作成
        const diaryModel    = this.createDiaryModel(message.text, channelId, threadTs, permalink);
        diaryModel.postedAt = new Date().toFormat('HH24:MI:SS');

        // DB登録
        let date = diaryModel.date;
        try {
            // DB新規重複チェック
            const result = await this.postDataRepository.getDiaryByDate(channelId, date);
            if (result) return `日付が重複しています。(${date})`;

            // diaryModelをDBに登録
            const response = await this.postDataRepository.putItem(diaryModel);

            // httpStatusCodeを判断しreturn
            const httpStatusCode = response?.$metadata.httpStatusCode;
            return this.checkHttpStatusCode(httpStatusCode, '登録', diaryModel);

        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    }

    /*
    **   日記編集処理
    */
    async processUpdateDiary (message, channelId) {
        const diaryModel = this.createDiaryModel(message.text, channelId, message.ts, '');
        diaryModel.editedAt = new Date().toFormat('HH24:MI:SS');

        // DB更新
        let date = diaryModel.date;
        try {
            // 更新元情報を取得しdiaryModelの値をマージ
            const partitionKey = diaryModel.partitionKey;
            const getResult = await this.postDataRepository.getDiaryByDate(partitionKey, date);
            if (getResult) {
                diaryModel.postedAt = getResult.posted_at;
                diaryModel.slackUrl = getResult.slack_url;
            }

            // diaryModelをDBに登録
            const response = await this.postDataRepository.putItem(diaryModel);

            // httpStatusCodeを判断しreturn
            const httpStatusCode = response?.$metadata.httpStatusCode;
            return this.checkHttpStatusCode(httpStatusCode, '更新', diaryModel);

        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    }

    // -----------------------------------------------------------------------------------------
    // DiaryModel生成処理
    createDiaryModel (text, channelId, threadTs, permalink) {
        let date = DiaryUtils.parseDate(text);

        const diaryModel = new DiaryModel(channelId, date);
        diaryModel.workingPlaceCd  = DiaryUtils.parseWorkingPlaceCd(text);
        diaryModel.content         = DiaryUtils.parseContent(text);
        diaryModel.threadTs        = threadTs;
        diaryModel.slackUrl        = permalink;

        return diaryModel;
    }

    // DynamoDBへのPut成否をhttpStatusCodeから判断してreturnを作成する
    checkHttpStatusCode (httpStatusCode, msg, diaryModel) {
        if (httpStatusCode == 200) {
            return `日記(${diaryModel.date})のDB${msg}に成功しました。\n${diaryModel.slackUrl}`;
        } else {
            throw new Error(
                `日記(${diaryModel.date})のDB${msg}に失敗しました。httpStatusCode=${httpStatusCode}`
            )
        }
    }
}

exports.DiaryService = DiaryService;