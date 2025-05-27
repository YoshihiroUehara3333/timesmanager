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
    async generateFeedback(message){
        // DBから業務日誌情報を取得
        try {
            const diary = await this.diaryRepository.getDiaryByThreadTs(message.thread_ts);
            if (!diary) return "DBから日報を取得できませんでした。";
            return this.feedbackGenerator.generateFeedback(diaryModel);

        } catch (error) {
            console.error("エラー:", error);
            throw new Error("フィードバック生成中にエラーが発生しました。");
        }
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
            if (result.Item) return `日付が重複しています。(${date})`;

            let data = await this.diaryRepository.putDiary(diaryModel);
            if (data.$metadata.httpStatusCode == 200) {
                return  `日記(${date})のDB登録に成功しました。`;
            }
        } catch (error) {
            console.error("DB新規重複チェック時エラー:", error);
            throw new Error(`日記(${date})のDB登録に失敗しました。`);
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
            const result = await this.diaryRepository.getDiaryByPartitionKey(diaryModel);
            if (result.Item?.edited_ts === diaryModel.editedTs) {
                return `この日報はすでに最新の内容です。`;
            }
            diaryModel.slackUrl = result.Item.slack_url;
        } catch (error) {
            console.error("DB更新重複チェック時エラー:", error);
            throw new Error(`DB更新重複チェック時エラー(${error})`);
        }

        // DB保存実行
        let result = await this.diaryRepository.putDiary(diaryModel);
        if (result.$metadata.httpStatusCode == 200) {
            return  `日記(${date})のDB更新に成功しました。`;
        } else {
            throw new Error(`日記(${date})のDB更新に失敗しました。`);
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