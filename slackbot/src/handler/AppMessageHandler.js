// app.message受け取り時

// モジュール読み込み
const { HandlerBase } = require('./HandlerBase');
const { SlackConst }  = require('../constants/SlackConst');
const { RegexConst }  = require('../constants/RegexConst');
const { PostMessage } = require('../slack/SlackApiRequest');

class AppMessageHandler extends HandlerBase{
    constructor ({
        dailyReportService,
        threadService,
        slackApiAdaptor
    }) {
        super({slackApiAdaptor});

        this.dailyReportService = dailyReportService;
        this.threadService      = threadService;

        this.dispatcher = {
            'handleEditedTopLevelMessage' : this.handleEditedTopLevelMessage.bind(this),
            'handleNewTopLevelMessage'    : this.handleNewTopLevelMessage.bind(this),
            'handleThreadCommand'         : this.handleThreadCommand.bind(this),
            'default'                     : this.handleDefault.bind(this)
        }
    }

    async handle (body, message, logger) {
        const handler = this.dispatcher[this.checkMessagetype(message)] || this.dispatcher['default'];
        const userId = message.user;
        logger.info(`${handler.name}を実行`);
        await this.execute(handler, userId, body, logger);
    }

    // スレッド外部かつ、新規ポスト時
    async handleNewTopLevelMessage (message) {
        if (this.isDiary(message)) {
            const result = await this.dailyReportService.processNewDiaryEntry(message);
            return new PostMessage(
                message.user,
                result.msg
            )
        }
    }

    // 投稿編集時
    async handleEditedTopLevelMessage (messageRaw) {
        const message = messageRaw.message;
        message.channel = messageRaw.channel;
        
        if (this.isDiary(message)) {
            const result = await this.dailyReportService.processUpdateDiary(message);
            return new PostMessage(
                message.user,
                result.msg
            )
        }
    }

    async handleThreadCommand(message, logger) {
        // /AIフィードバック
        if (message.text.match(RegexConst.THREADCOMMANDS.AI_FEEDBACK)) {
            const result = await this.dailyReportService.generateFeedback(message);
            return new PostMessage(
                message.channel,
                result.msg,
                message.thread_ts
            )
        }
    }

    checkMessagetype(message) {
        if (message.subtype === 'message_changed') {
            if (this.isInThread(message)) {
                return this.isBotMentioned(message) ? 'handleThreadCommand' : 'default';
            } 
            return 'handleEditedTopLevelMessage';
        } else {
            return this.isInThread(message) ? 'default' : 'handleNewTopLevelMessage';
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