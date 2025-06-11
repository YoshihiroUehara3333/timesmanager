// モジュール読み込み
require('date-utils');
const { DiaryUtils }  = require('../utility/DiaryUtils');
const { DiaryModel }  = require('../model/DiaryModel');
const { POSTDATA }    = require('../constants/DynamoDB/PostData');
const { PostMessage, GetPermalink } = require('../adaptor/slack/SlackApiRequest');

class DiaryService {
    constructor(postDataRepository, aiApiAdaptor, slackApiAdaptor) {
        this.postDataRepository = postDataRepository;
        this.openAiApiAdaptor = aiApiAdaptor;
        this.slackApiAdaptor = slackApiAdaptor;
    }


    /**
     *  日報が新規投稿された際の処理を行う
     *  @param   {Object} message - Slack APIから受け取ったリクエストの値
     *  @returns {PostMessage}    - postMessageに引き渡すrequest DTO
     */
    async processNewDiaryEntry (message) {
        // messageから値を取得
        const channelId = message.channel;
        const threadTs  = message.ts;
        
        // 投稿URLを取得
        let permalink = await this.slackApiAdaptor.getPermalink(new GetPermalink(
            channelId, 
            threadTs
        ));

        // DiaryModelを作成
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

            // httpStatusCodeを判断しpostMessage用のtextを作成
            const httpStatusCode = response?.$metadata.httpStatusCode;
            const postText = this.checkHttpStatusCode(httpStatusCode, '登録', diaryModel);

            return new PostMessage(
                message.user,
                postText,
            );
        } catch (error) {
            throw new Error(error.message, {cause: error});
        }
    }

    /**
     *  日報が編集された際の処理を行う
     *  @param   {Object} message - Slack APIから受け取ったリクエストの値
     *  @returns {PostMessage}    - postMessageに引き渡すrequest DTO
     */
    async processUpdateDiary (message, channelId) {
        // DiaryModelを作成
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
            const postText = this.checkHttpStatusCode(httpStatusCode, '登録', diaryModel);

            return new PostMessage(
                message.user,
                postText,
            );
        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    }

    /**
     *  thread_tsを基にフィードバックを生成し、returnする
     *  @param   {Object} message - Slack APIから受け取ったリクエストの値
     *  @returns {PostMessage}    - postMessageに引き渡すrequest DTO
     */
    async generateFeedback(message){
        // messageから値を取得
        const threadTs = message.thread_ts;
        const channelId = message.channel;

        // DBから業務日誌情報を取得
        try {
            // 日報データをDBから取得
            const partitionKey = `${channelId}#${POSTDATA.PK_POSTFIX.DIARY}`;
            const queryResult = await this.postDataRepository.queryByPartitionKeyAndThreadTs(partitionKey, threadTs);
            if (queryResult == null) return `DBから日報データを取得できませんでした。`;
            // たいていは1件のみ想定
            const diary = queryResult[0];

            // フィードバックを生成してreturn
            const feedbackText = await this.aiApiAdaptor.generateFeedback(diary);
            return new PostMessage(
                channelId,
                feedbackText,
                threadTs
            );
        } catch (error) {
            throw new Error(`フィードバック生成中にエラーが発生しました。${error.message}`, { cause: error });
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
                `日記(${diaryModel.date})のDB${msg}に失敗しました。\n`
                + `httpStatusCode=${httpStatusCode}`
            )
        }
    }
}

exports.DiaryService = DiaryService;