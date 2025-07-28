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
            // 'handleEditedThreadMessage'   : this.handleEditedThreadMessage.bind(this),
            // 'handleNewThreadMessage'      : this.handleNewThreadMessage.bind(this),
            'handleNewTopLevelMessage'    : this.handleNewTopLevelMessage.bind(this),
            'handleThreadCommand'         : this.handleThreadCommand.bind(this),
            'default'                     : this.handleDefault.bind(this)
        }
    }

    async handle (message, logger) {
        const handler = this.dispatcher[this.checkMessagetype(message)] || this.dispatcher['default'];
        let slackRequest;
        try {
            slackRequest = await handler(message, logger);
        } catch (error) {
            logger.error(error.stack);
            slackRequest = new PostMessage(message.user, error.toString());
        } finally {
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        }
    }

    // スレッド外部かつ、新規ポスト時
    async handleNewTopLevelMessage (message, logger) {
        logger.info("handleTopLevelNewMessageが実行されました");

        if (this.isDiary(message)) {
            logger.info("diaryService.newDiaryEntryを実行");
            const result = await this.diaryService.processNewDiaryEntry(message);
            return new PostMessage(
                message.user,
                result.msg
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
            const result = await this.diaryService.processUpdateDiary(message);
            return new PostMessage(
                message.user,
                result.msg
            )
        }
    }

    // async handleEditedThreadMessage (message, logger) {
    //     logger.info("handleEditedThreadMessageが実行されました");
    // }

    // // スレッド内部かつ、新規ポストかつ、ボットメンションではない
    // async handleNewThreadMessage (message, logger) {
    //     logger.info("handleNewThreadMessageが実行されました");
    //     return this.threadService.processNewThreadPost(message, logger);
    // }


    async handleThreadCommand(message, logger) {
        // /AIフィードバック
        if (message.text.match(RegexConst.THREADCOMMANDS.AI_FEEDBACK)) {
            logger.info("diaryService.aiFeedbackを実行");
            const result = await this.diaryService.generateFeedback(message);
            return new PostMessage(
                message.channel,
                result.msg,
                message.thread_ts
            )
        }
    }

    async handleDefault(message, logger){
        return undefined;
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
}
;

exports.AppMessageHandler = AppMessageHandler;