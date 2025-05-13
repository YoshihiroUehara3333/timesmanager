// app_mention
//
//

// モジュール読み込み
class AppMentionController {
  constructor(diaryService, slackService, slackPresenter) {
    this.diaryService = diaryService;
    this.slackService = slackService;
    this.slackPresenter = slackPresenter;
  }

    async handleAppMention (event , context, logger, client) {    
        // スレッド内返信の場合
        if(event.thread_ts){
            await this.handleThreadMention(event, logger, client);
        // スレッド以外の場合
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
    }
};

exports.AppMentionController = AppMentionController;