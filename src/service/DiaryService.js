// モジュール読み込み
require('date-utils');
const { DiaryModelFactory }  = require('../model/factory/DiaryModelFactory');
const { POSTDATA }           = require('../constants/DynamoDB/PostData');
const { PostMessage, GetPermalink } = require('../adaptor/slack/SlackApiRequest');

/**
 * Slackメッセージから日報を処理・保存・更新・フィードバック生成するためのサービスクラス
 */
class DiaryService {
    constructor(postDataRepository, aiApiAdaptor, slackApiAdaptor) {
        this.postDataRepository = postDataRepository;
        this.openAiApiAdaptor = aiApiAdaptor;
        this.slackApiAdaptor = slackApiAdaptor;
    }

    /**
     *  日報が新規投稿された際の処理を行う
     *  @param   {Object} message - Slack APIから受け取ったメッセージオブジェクト
     *  @returns {PostMessage}    - postMessageに引き渡すrequest DTO
     */
    async processNewDiaryEntry (message) {
        // DiaryModelを作成
        const diaryModel = DiaryModelFactory.createDiaryModelFromMessage(message);
        diaryModel.slackUrl = await this.slackApiAdaptor.send(new GetPermalink(message.channel, message.ts));
        diaryModel.postedAt = new Date().toFormat('HH24:MI:SS');

        // DB登録
        try {
            let date = diaryModel.date;

            // DB新規重複チェック
            const result = await this.postDataRepository.getDiaryByDate(diaryModel.channelId, date);
            if (result) return `日付が重複しています。(${date})`;

            // diaryModelをDBに登録
            const response = await this.postDataRepository.putItem(diaryModel);

            // httpStatusCodeを判断しpostMessage用のtextを作成
            const httpStatusCode = response?.$metadata.httpStatusCode;
            const postText = this.checkHttpStatusCode(httpStatusCode, '登録', diaryModel);
            return new PostMessage(
                message.user,
                postText
            );
        } catch (error) {
            throw new Error(error.message, {cause: error});
        }
    }

    /**
     *  日報が編集された際の処理を行う
     *  @param   {Object} message - Slack APIから受け取ったメッセージオブジェクト
     *  @returns {PostMessage}    - postMessageに引き渡すrequest DTO
     */
    async processUpdateDiary (message) {
        // DiaryModelを作成
        const diaryModel = DiaryModelFactory.createDiaryModelFromMessage(message);
        diaryModel.editedAt = new Date().toFormat('HH24:MI:SS');

        // DB更新
        try {
            // 更新元情報を取得しdiaryModelの値をマージ
            let partitionKey = diaryModel.partitionKey;
            let date = diaryModel.date;
            const getResult = await this.postDataRepository.getDiaryByDate(partitionKey, date);
            if (getResult) {
                diaryModel.postedAt = getResult.posted_at;
                diaryModel.slackUrl = getResult.slack_url;
            }

            // diaryModelをDBに登録
            const response = await this.postDataRepository.putItem(diaryModel);

            // httpStatusCodeを判断しpostMessage用のtextを作成
            const httpStatusCode = response?.$metadata.httpStatusCode;
            const postText = this.checkHttpStatusCode(httpStatusCode, '登録', diaryModel);

            // return
            return new PostMessage(
                message.user,
                postText
            );
        } catch (error) {
            throw new Error(error.message, {cause: error});
        }
    }

    /**
     *  thread_tsを基にフィードバックを生成し、returnする
     *  @param   {Object} message - Slack APIから受け取ったメッセージオブジェクト
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
            if (queryResult.length === 0) return `DBから日報データを取得できませんでした。`;
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
    // DynamoDBへのPut成否をhttpStatusCodeから判断してreturnを作成する
    checkHttpStatusCode (httpStatusCode, msg, diaryModel) {
        if (httpStatusCode === 200) {
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