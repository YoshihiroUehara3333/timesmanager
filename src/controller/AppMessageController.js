// app.message受け取り時

// モジュール読み込み
const { SlackConst }  = require('../constants/SlackConst');
const { RegexConst }  = require('../constants/RegexConst');
const { PostMessage } = require('../adaptor/slack/SlackApiRequest');

class AppMessageController {
    constructor (diaryService, threadService, slackApiAdaptor) {
        this.diaryService    = diaryService;
        this.threadService   = threadService;
        this.slackApiAdaptor = slackApiAdaptor;

        this.subtypeDispatcher = {
            'message_changed'   : this.handleEditedMessage.bind(this),
            'default'           : this.handleNewMessage.bind(this),
        }
    }

    async handleAppMessage (message, logger) {
        logger.info("handleAppMessageが実行されました");
        try {
            const handler = this.subtypeDispatcher[message.subtype] || this.subtypeDispatcher['default'];
            const slackRequest = await handler(message, logger);
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(message.user, error.toString())
            )
        }
    }

    // 新規投稿時
    async handleNewMessage (message, logger) {
        logger.info("handleNewMessageが実行されました");
        
        if(this.isInThread(message)) {
            return await this.handleNewThreadMessage(message, logger);
        } else {
            return await this.handleNewTopLevelMessage(message, logger);
        }
    }

    // 投稿編集時
    async handleEditedMessage (messageRaw, logger) {
        logger.info("handleEditedMessageが実行されました");
        const message = messageRaw.message;
        message.channel = messageRaw.channel;
        
        if (this.isInThread(message)) {
            // スレッド投稿を編集した時
            return;
        } else if (this.isDiary(message)) {
            // 日記編集時
            logger.info("diaryService.processUpdateDiaryを実行");
            return await this.diaryService.processUpdateDiary(message, channelId);
        }
    }

    // スレッド内部かつ、新規ポストかつ、ボットメンションではない
    async handleNewThreadMessage (message, logger) {
        logger.info("handleNewThreadMessageが実行されました");

        if (this.isBotMentioned(message)) {
            // /AIフィードバック
            if (message.text.match(RegexConst.THREADCOMMANDS.AI_FEEDBACK)) {
                logger.info("diaryService.aiFeedbackを実行");
                return await this.diaryService.generateFeedback(message);
            }
        }
        // 壁スレッドの中身だった場合ThreadServiceを使ってDBにtextを保存する
        return this.threadService.processNewThreadPost(message, logger);
    }

    // スレッド外部かつ、新規ポスト時
    async handleNewTopLevelMessage (message, logger) {
        logger.info("handleTopLevelNewMessageが実行されました");

        if (this.isDiary(message)) {
            logger.info("diaryService.newDiaryEntryを実行");
            return await this.diaryService.processNewDiaryEntry(message);
        }
    }

    // Helper Methods ---------------------------------------------------------------------
    isBotMentioned (message) {
        return message.text.match(`<@${SlackConst.ID.botUserId}>`);
    }

    isInThread (message) {
        return !!message.thread_ts;
    }

    isDiary (message) {
        return message.text.match(RegexConst.DATE);
    }
};

exports.AppMessageController = AppMessageController;