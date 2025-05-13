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

        if (isEdited) {
            await this.handleEditedMessage(message, logger, client);
        } else {
            await this.handleNewMessage(message, logger, client);
        }
    };

    async handleNewMessage (message, logger, client) {
        logger.info("handleNewMessageが実行されました");
        const text = message.text;
        const userId = message.user;

        var msg;
        // メンションを含む場合
        if (text.match(`<@${SlackConstants.ID.botUserId}>`)) {
            logger.debug("メンションを含む場合");
            if (text.match(/\*【日記】\*([^\n]+)/)) {
                // 新規投稿時
                logger.info("diaryService.newDiaryEntryを実行");
                msg = await this.diaryService.newDiaryEntry(message, client);
                logger.info("diaryService.newDiaryEntryが終了:" + JSON.stringify(msg));
            }
        }

        try {
            await this.slackPresenter.sendDirectMessage(client, msg, userId);
            logger.info("DM送信成功");
        } catch (error) {
            console.error("DM送信時エラー:", error);
        }
    }

    async handleEditedMessage (message, logger, client) {
        logger.info("handleEditedMessageが実行されました");
        const text = message.message.text;
        const userId = message.message.user;

        var msg;
        // メンションを含む場合
        if (text.match(`<@${SlackConstants.ID.botUserId}>`)) {
            logger.debug("メンションを含む場合");
            if (text.match(/\*【日記】\*([^\n]+)/)) {
                // 日記編集時
                logger.info("diaryService.updateDiaryを実行");
                msg = await this.diaryService.updateDiary(message, client);
                logger.info("diaryService.updateDiaryが終了:" + JSON.stringify(msg));
            }
        }

        try {
            await this.slackPresenter.sendDirectMessage(client, msg, userId);
            logger.info("DM送信成功");
        } catch (error) {
            console.error("DM送信時エラー:", error);
        }
    }
};

exports.AppMessageController = AppMessageController;