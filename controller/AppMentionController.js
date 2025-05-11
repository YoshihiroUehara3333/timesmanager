// app_mention
//
//

// モジュール読み込み
const { DiaryModel } = require('../model/DiaryModel');

class AppMentionController {
  constructor(diaryService, presenter) {
    this.diaryService = diaryService;
    this.presenter = presenter;
  }

    async handleAppMention (event , context, logger, client) {    
        if (context.retryNum) return; // リトライ以降のリクエストは弾く
        logger.info('受信イベント出力；' + JSON.stringify((event)));
        var msg;

        // チャンネル情報を取得
        const channel = event.channel;
        const userId = event.user;

        // スレッド内返信の場合はAIにフィードバックを作ってもらう
        if(event.thread_ts){
            const thread_ts = event.thread_ts;
            logger.info("diaryService.replyFeedbackを実行");
            msg = await this.diaryService.replyFeedback(thread_ts, channel);
            logger.info("diaryService.replyFeedbackが終了；" + JSON.stringify(msg));

            try {
                await this.presenter.sendThreadMessage(client, msg, channel, thread_ts);
                logger.info("フィードバックを返信しました");
            } catch (error) {
                logger.error("フィードバックの返信に失敗:", error);
            }
            return;
        };

        // イベント情報から日誌情報を生成する
        const diaryModel = new DiaryModel(event);
        
        // 本文に日付情報が書かれていない場合、処理を終了
        if (diaryModel.date === '') {
            return;
        }

        // 日記新規投稿時
        if (!event.edited) {
            logger.info("diaryService.newDiaryEntryを実行");
            msg = await this.diaryService.newDiaryEntry(diaryModel, channel);
            logger.info("diaryService.newDiaryEntryが終了:" + JSON.stringify(msg));

        // 日記編集時
        } else { 
            logger.info("diaryService.updateDiaryを実行");
            msg = await this.diaryService.updateDiary(diaryModel, channel);
            logger.info("diaryService.updateDiaryが終了:" + JSON.stringify(msg));

        }
        // 投稿者にDMで通知
        try {
            await this.presenter.sendDirectMessage(client, msg, userId);
            logger.info("DM送信成功");
        } catch (error) {
            console.error("DM送信時エラー:", error);
        }
        return;
    }
};

exports.AppMentionController = AppMentionController;