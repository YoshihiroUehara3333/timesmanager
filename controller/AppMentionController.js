// app_mention
//
//

// モジュール読み込み
const { DiaryModel } = require('../model/DiaryModel');

class AppMentionController {
  constructor(diaryService, slackService, slackPresenter) {
    this.diaryService = diaryService;
    this.slackService = slackService;
    this.slackPresenter = slackPresenter;
  }

    async handleAppMention (event , context, logger, client) {    
        if (context.retryNum) return; // リトライ以降のリクエストは弾く
        logger.info('受信イベント出力；' + JSON.stringify((event)));

        // スレッド内返信の場合
        if(event.thread_ts){
            await this.handleThreadMention(event, logger, client);

        // スレッド以外の場合
        } else {
            await this.handlePostMention(event, logger, client);
        }
        return;
    }

    async handleThreadMention (event, logger, client) {
        // AIにフィードバックを作ってもらう
        const thread_ts = event.thread_ts;
            
        logger.info("diaryService.replyFeedbackを実行");
        const msg = await this.diaryService.generateFeedback(thread_ts);
        logger.info("diaryService.replyFeedbackが終了；" + JSON.stringify(msg));

        // チャンネル情報を取得
        const channel = event.channel;
        try {
            await this.slackPresenter.sendThreadMessage(client, msg, channel, thread_ts);
            logger.info("フィードバックを返信しました");
        } catch (error) {
            logger.error("フィードバックの返信に失敗:", error);
        }
    };

    async handlePostMention (event, logger, client) {
        var msg;

        // イベント情報から日誌情報を生成する
        const diaryModel = new DiaryModel(event);
        if (diaryModel.date === '') return;

        // 投稿のUrl取得
        diaryModel.slackUrl = await this.slackService.getPermalink(diaryModel);

        // 日記新規投稿時
        if (!event.edited) {
            logger.info("diaryService.newDiaryEntryを実行");
            msg = await this.diaryService.newDiaryEntry(diaryModel);
            logger.info("diaryService.newDiaryEntryが終了:" + JSON.stringify(msg));

        // 日記編集時
        } else { 
            logger.info("diaryService.updateDiaryを実行");
            msg = await this.diaryService.updateDiary(diaryModel);
            logger.info("diaryService.updateDiaryが終了:" + JSON.stringify(msg));
        }

        // チャンネル情報を取得
        const userId = event.user;
        try {
            await this.slackPresenter.sendDirectMessage(client, msg, userId);
            logger.info("DM送信成功");
        } catch (error) {
            console.error("DM送信時エラー:", error);
        }
    }
};

exports.AppMentionController = AppMentionController;