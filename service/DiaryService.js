// モジュール読み込み
const AWS = require('aws-sdk');

const { SlackURLConstants } = require('../constants/SlackURLConstants');
const networkUtils = require('../utility/networkUtils');

class DiaryService {
    constructor(diaryRepository, feedbackGenerator) {
        this.diaryRepository = diaryRepository;
        this.feedbackGenerator = feedbackGenerator;
    };

    /*
    **   thread_tsを基にフィードバックを生成する
    */
    async generateFeedback(thread_ts){
        // DBから業務日誌情報を取得
        var diaryModel;
        try {
            diaryModel = await this.diaryRepository.getDiaryByThreadTs(thread_ts);
            if (!diaryModel) {
                return "DBから日報を取得できませんでした。";
            }
        } catch (error) {
            console.error("DB取得時エラー:", error);
            return `DBアクセスエラー(${error})`;
        };
        
        console.log(JSON.stringify(diaryModel));
        return this.feedbackGenerator.generateFeedback(diaryModel);
    };

    /*
    **   日記新規登録処理
    */
    async newDiaryEntry (diaryModel) {
        const date = diaryModel.date;

        // DB新規重複チェック
        try {
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel.partitionKey);
            if (result.Item) {
                return `日付が重複しています。(${date})`;
            }
        } catch (error) {
            console.error("DB新規重複チェック時エラー:", error);
            return `DBアクセスエラー(${error})`;
        }

        // DB保存実行
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
    async updateDiary (diaryModel) {
        const editedTs = diaryModel.editedTs;
        const date = diaryModel.date;

        // DB更新重複チェック
        try {
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel.partitionKey);
            if (result.Item.edited_ts != null && result.Item.edited_ts === editedTs) {
                return `更新が重複しています。`;
            }

            // 更新元レコードからデータを取得する
            diaryModel.slackUrl = result.Item.slack_url;
            diaryModel.eventTs = result.Item.event_ts;

        } catch (error) {
            console.error("DB更新重複チェック時エラー:", error);
            return `DBアクセスエラー(${error})`;
        }

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