// app.message受け取り時

// モジュール読み込み
const { SlackConst }  = require('../constants/SlackConst');
const { RegexConst }  = require('../constants/RegexConst');
const { PostMessage } = require('../slack/SlackApiRequest');

class AppMessageHandler {
    constructor ({diaryService, threadService, slackApiAdaptor}) {
        this.diaryService    = diaryService;
        this.threadService   = threadService;
        this.slackApiAdaptor = slackApiAdaptor;

        this.dispatcher = {
            'handleEditedTopLevelMessage' : this.handleEditedTopLevelMessage.bind(this),
            'handleEditedThreadMessage'   : this.handleEditedThreadMessage.bind(this),
            'handleNewThreadMessage'      : this.handleNewThreadMessage.bind(this),
            'handleNewTopLevelMessage'    : this.handleNewTopLevelMessage.bind(this),
            'handleThreadCommand'         : this.handleThreadCommand.bind(this),
        }
    }

    async handle (message, logger) {
        try {
            const handler = this.dispatcher[this.checkMessagetype(message)];
            const result = await handler(message, logger);
            if (result?.slackRequest) {
                await this.slackApiAdaptor.send(result.slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(message.user, error.toString())
            )
        }
    }

    // 投稿編集時
    async handleEditedTopLevelMessage (messageRaw, logger) {
        logger.info("handleEditedTopLevelMessageが実行されました");
        const message = messageRaw.message;
        message.channel = messageRaw.channel;
        
        if (this.isDiary(message)) {
            logger.info("diaryService.processUpdateDiaryを実行");
            return await this.diaryService.processUpdateDiary(message);
        }
    }

    async handleEditedThreadMessage (message, logger) {
        logger.info("handleEditedThreadMessageが実行されました");
    }

    // スレッド内部かつ、新規ポストかつ、ボットメンションではない
    async handleNewThreadMessage (message, logger) {
        logger.info("handleNewThreadMessageが実行されました");
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

    async handleThreadCommand(message, logger) {
        // /AIフィードバック
        if (message.text.match(RegexConst.THREADCOMMANDS.AI_FEEDBACK)) {
            logger.info("diaryService.aiFeedbackを実行");
            return await this.diaryService.generateFeedback(message);
        }
    }

    checkMessagetype(message) {
        if (message.subtype === 'message_changed') {
            if (this.isInThread(message)) {
                return this.isBotMentioned(message) ? 'handleThreadCommand' : 'handleEditedThreadMessage';
            } 
            return 'handleEditedTopLevelMessage';
        } else {
            return this.isInThread(message) ? 'handleNewThreadMessage' : 'handleNewTopLevelMessage';
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

exports.AppMessageHandler = AppMessageHandler;