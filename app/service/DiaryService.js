// モジュール読み込み
const { DiaryUtils } = require('../utility/DiaryUtils');
const { DiaryModel } = require('../model/DiaryModel');
const { DBConst } = require('../constants/DBConst');

class DiaryService {
    constructor(postDataRepository, feedbackGenerator) {
        this.postDataRepository = postDataRepository;
        this.feedbackGenerator = feedbackGenerator;
    };

    /*
    **   thread_tsを基にフィードバックを生成する
    */
    async generateFeedback(message){
        const threadTs = message.thread_ts;

        // DBから業務日誌情報を取得
        try {
            const diary = await this.postDataRepository.queryByThreadTsAndSortKeyPrefix(threadTs, DBConst.SORT_KEY_BASE.DIARY);
            if (!diary) return "DBから日報を取得できませんでした。";
            return await this.feedbackGenerator.generateFeedback(diary);

        } catch (error) {
            throw new Error("フィードバック生成中にエラーが発生しました。");
        }
    };

    /*
    **   日記新規登録処理
    */
    async processNewDiaryEntry (message, client) {
        // 投稿URLを取得
        let { permalink } = await client.chat.getPermalink({
            channel    : message.channel,
            message_ts : message.ts
        });

        // diaryModelを作成
        const diaryModel = this.createDiaryModel(message, permalink);
        diaryModel.postedAt = new Date().toISOString();

        // DB新規重複チェック
        const date = diaryModel.date;
        try {
            const result = await this.postDataRepository.getDiaryByDate(message.channel, date);
            if (result) return `日付が重複しています。(${date})`;

            const response = await this.postDataRepository.putItem(diaryModel);
<<<<<<< HEAD
=======
            console.log(JSON.stringify(response));
>>>>>>> 2f5abba8d64db41938b176e0663052d754b59fbc
            const httpStatusCode = response?.$metadata.httpStatusCode;
            if (httpStatusCode == 200) {
                return `日記(${date})のDB登録に成功しました。`;
            } else {
                throw new Error(`日記(${date})のDB登録に失敗しました。httpStatusCode=${httpStatusCode}`, { cause: error });
            }

        } catch (error) {
            throw new Error(`日記(${date})のDB登録に失敗しました。`, { cause: error });
        }
    }

    /*
    **   日記編集処理
    */
    async processUpdateDiary (message) {
        const diaryModel = this.createDiaryModel(message, '');
        diaryModel.editedAt = new Date().toISOString();

        // DB更新
        const date = diaryModel.date;
        try {
            const getPartitionKey = diaryModel.channel;
            const getResult = await this.postDataRepository.getDiaryByDate(getPartitionKey, date);
            if (getResult.slack_url) {
                diaryModel.slackUrl = getResult.slack_url;
            }

            return await this.postDataRepository.putItem(diaryModel);
        } catch (error) {
            throw new Error(`日記(${date})のDB更新に失敗しました。`, { cause: error });
        }
    };


    // DiaryModel生成処理
    createDiaryModel (message, permalink) {
        const text    = message.text;

        const diaryModel = new DiaryModel(message.channel);
        diaryModel.date                = DiaryUtils.parseDate(text);
        diaryModel.workingPlaceCd      = DiaryUtils.parseWorkingPlaceCd(text);
        diaryModel.content             = DiaryUtils.parseContent(text);
        diaryModel.threadTs            = message.ts;
        diaryModel.slackUrl            = permalink;

        return diaryModel;
    }
}

exports.DiaryService = DiaryService;