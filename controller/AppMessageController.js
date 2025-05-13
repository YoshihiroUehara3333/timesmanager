// app.message受け取り時
//

// モジュール読み込み
const { SlackConstants } = require('../constants/SlackConstants');

class AppMessageController {
    constructor (diaryService, slackPresenter) {
        this.diaryService = diaryService;
        this.slackPresenter = slackPresenter;
    };

    async handleAppMessage (message, logger, client) {
        logger.info("handleAppMessageが実行されました");
        const isEdited = message.subtype === 'message_changed';

        // subtypeによってmessageの構造が異なる為まずsubtypeを見る
        if (isEdited) {
            await this.handleEditedMessage(message, logger, client);
        } else {
            await this.handleNewMessage(message, logger, client);
        }
    };

    async handleNewMessage (message, logger, client) {
        logger.info("handleNewMessageが実行されました");
        var msg = 'handleNewMessage初期値';

        const text = message.text;
        const userId = message.user;

        if (text.match(/\*【日記】\*([^\n]+)/)) {
            // 日記新規投稿時
            try {
                logger.info("diaryService.newDiaryEntryを実行");
                msg = await this.diaryService.newDiaryEntry(message, client);
                logger.info("diaryService.newDiaryEntryが終了:" + JSON.stringify(msg));

                await this.slackPresenter.sendDirectMessage(client, msg, userId);
                logger.info("DM送信成功");
            } catch (error) {
                console.error("DM送信時エラー:", error);
            }

        } else if (text.match(`<@${SlackConstants.ID.botUserId}>`)) {
            const channel = message.channel;
            const threadTs = message.thread_ts;
            // ボットメンション時
            // /AIフィードバック
            if (text.match(/\/AIフィードバック/)) {
                try {
                    logger.info("diaryService.aiFeedbackを実行");
                    msg = await this.diaryService.generateFeedback(message, client);
                    logger.info("diaryService.aiFeedbackが終了:" + JSON.stringify(msg));

                    await this.slackPresenter.sendThreadMessage (client, msg, channel, threadTs);
                    logger.info("フィードバック送信成功");
                } catch (error) {
                    console.error("フィードバック送信時エラー:", error);
                }
            }
        }
    };

    async handleEditedMessage (message, logger, client) {
        logger.info("handleEditedMessageが実行されました");
        var msg = 'handleEditedMessage初期値';

        const text = message.message.text;
        const userId = message.message.user;

        if (text.match(/\*【日記】\*([^\n]+)/)) {
            // 日記編集時
            try {
                logger.info("diaryService.updateDiaryを実行");
                msg = await this.diaryService.updateDiary(message, client);
                logger.info("diaryService.updateDiaryが終了:" + JSON.stringify(msg));

                await this.slackPresenter.sendDirectMessage(client, msg, userId);
                logger.info("DM送信成功");
            } catch (error) {
                console.error("DM送信時エラー:", error);
            }
        }            
    };
};

exports.AppMessageController = AppMessageController;