// モジュール読み込み
const { DiaryUtils } = require('../utility/DiaryUtils');
const { DiaryModel } = require('../model/DiaryModel');

class DiaryService {
    constructor(diaryRepository, feedbackGenerator) {
        this.diaryRepository = diaryRepository;
        this.feedbackGenerator = feedbackGenerator;
    };

    /*
    **   thread_tsを基にフィードバックを生成する
    */
    async generateFeedback(message, client){
        var diaryModel;

        // DBから業務日誌情報を取得
        try {
            diaryModel = await this.diaryRepository.getDiaryByThreadTs(message.thread_ts);
            if (!diaryModel) {
                return "DBから日報を取得できませんでした。";
            }
        } catch (error) {
            console.error("DB取得時エラー:", error);
            return `DBアクセスエラー(${error})`;
        };
        
        return this.feedbackGenerator.generateFeedback(diaryModel);
    };

    /*
    **   日記新規登録処理
    */
    async newDiaryEntry (message, client) {
        const text = message.text;
        const date = DiaryUtils.parseDate(text);
        const content = DiaryUtils.parseContent(text);

        // 投稿URLを取得
        let { permalink } = await client.chat.getPermalink({
            channel: message.channel,
            message_ts: message.ts
        });

        // diaryModelを作成
        const diaryModel = this.createDiaryModel(message, date, content, permalink)

        // DB新規重複チェック
        try {
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel);
            if (result.Item) {
                return `日付が重複しています。(${date})`;
            }
        } catch (error) {
            console.error("DB新規重複チェック時エラー:", error);
            return `DBアクセスエラー(${error})`;
        }

        // DB保存実行
        let result = await this.diaryRepository.putDiary(diaryModel);
        if (result.httpStatusCode == 200) {
            return  `日記(${diaryModel.date})のDB登録に成功しました。`;
        } else {
            return `日記(${diaryModel.date})のDB登録に失敗しました。`;
        }
    }

    /*
    **   日記編集処理
    */
    async updateDiary (message, client) {
        const text = message.message.text;
        const date = DiaryUtils.parseDate(text);
        const content = DiaryUtils.parseContent(text);
        const diaryModel = this.createDiaryModel(message.message, date, content, null);

        // DB更新重複チェック
        try {
            console.log(diaryModel.partitionKey);
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel);
            console.log(JSON.stringify(result));
            if (result.Item.edited_ts && result.Item.edited_ts === diaryModel.editedTs) {
                return `更新が重複しています。`;
            }
            // 更新元レコードからデータを取得する
            diaryModel.slackUrl = result.Item.slack_url;
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

    // DiaryModel生成
    createDiaryModel (message, date, content, permalink) {
        const diaryModel = new DiaryModel();
        diaryModel.userId = message.user;
        diaryModel.channel = message.channel;
        diaryModel.date = date;
        diaryModel.eventTs = message.ts;
        diaryModel.content = content;
        diaryModel.slackUrl = permalink;
        diaryModel.clientMsgId = message.client_msg_id;
        return diaryModel;
    }
}

exports.DiaryService = DiaryService;