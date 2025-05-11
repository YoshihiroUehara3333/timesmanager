// モジュール読み込み
const AWS = require('aws-sdk');

const { SlackURLConstants } = require('../constants/SlackURLConstants');
const { DiaryModel } = require('../model/DiaryModel');
const networkUtils = require('../utility/networkUtils');

class DiaryService {
    constructor(diaryRepository, feedbackGenerator) {
        this.diaryRepository = diaryRepository;
        this.feedbackGenerator = feedbackGenerator;
    };


    /*
    **   thread_tsを基にフィードバックを生成する
    */
    async replyFeedback(thread_ts, channel){
        // DBから業務日誌情報を取得
        var diary;
        try {
            diary = await this.diaryRepository.getDiaryByThreadTs(thread_ts);
            if (!diary) {
                return "日報が見つかりませんでした。";
            }
        } catch (error) {
            console.error("DB取得時エラー:", error);
        };
        
        console.log(JSON.stringify(diary));
        return this.feedbackGenerator.generateFeedback(diary);
    };


    /*
    **   日記新規登録処理
    */
    async newDiaryEntry (diaryModel, channel) {
        // DB新規重複チェック
        try {
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel.partitionKey);
            if (result.Item) {
                return "日付が重複しています。";
            }
        } catch (error) {
            console.error("DB新規重複チェック時エラー:", error);
        }

        // SlackのURL取得
        var eventTs = diaryModel.eventTs;
        var headers = {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_USER_ACCESS_TOKEN
        }
        const url = `${SlackURLConstants.getPermalink}?channel=${channel}&message_ts=${eventTs}`;
        var response = await networkUtils.sendHttpRequest(url, 'GET', headers, undefined);
        diaryModel.slackUrl = JSON.parse(response).permalink;

        // DB保存実行
        const date = diaryModel.date;
        try {
            await this.diaryRepository.putDiary(diaryModel);
            return `日記(${date})のDB登録に成功しました。`;

        } catch (error) {
            console.error("DynamoDB登録時エラー:", error);
            return `日記(${date})のDB登録に失敗しました。`;
        }
    }

    /*
    **   日記編集処理
    */
    async updateDiary (diaryModel, channel) {
        const editedTs = diaryModel.editedTs;

        // DB更新重複チェック
        try {
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel.partitionKey);
            if (result.Item.edited_ts != null && result.Item.edited_ts === editedTs) {
                return;
            }
            console.log(result.Item);

            // 更新元レコードからデータを取得する
            diaryModel.slackUrl = result.Item.slack_url;
            diaryModel.eventTs = result.Item.event_ts;

        } catch (error) {
            console.error("DB更新重複チェック時エラー:", error);
        }

        const date = diaryModel.date;
        // DB保存用パラメータ設定
        try {
            await this.diaryRepository.putDiary(diaryModel);
            return `日記(${date})のDB更新に成功しました。`;
    
        } catch (error) {
            console.error("DynamoDB更新時エラー:", error);
            return `日記(${date})のDB更新に失敗しました。`;
        }
    };
}

exports.DiaryService = DiaryService;