// app.message受け取り時

// モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');
const { RegexConst } = require('../constants/RegexConst');

class AppMessageController {
    constructor (diaryService, threadService, slackApiAdaptor) {
        this.diaryService   = diaryService;
        this.threadService  = threadService;
        this.slackApiAdaptor = slackApiAdaptor;

        // subtype dispatcher
        this.subtypeHandlers = {
            'message_changed'   : this.handleEditedMessage.bind(this),
            'default'           : this.handleNewMessage.bind(this),
        }
    }

    // subtypeによってmessageの構造が異なる為まずsubtypeで処理を分ける
    async handleAppMessage (message, logger) {
        logger.info("handleAppMessageが実行されました");

        const subtypeHandler = this.subtypeHandlers[message.subtype] || this.subtypeHandlers['default'];
        return subtypeHandler(message, logger);
    }

    // 新規投稿時はこの関数で処理する
    // ・スレッドの内部/外部
    // ・メンション付きかどうか
    // 上記判定を行い、別関数に処理を移譲する。
    async handleNewMessage (message, logger) {
        logger.info("handleNewMessageが実行されました");
        
        if(this.isInThread(message)) {
            if (this.isBotMentioned(message)) {
                // スレッド内ボットメンションは現状疑似スラッシュコマンドのみ
                await this.handleNewThreadMentionMessage(message, logger);
            } else {
                // スレッド内部だった場合
                await this.handleNewThreadMessage(message, logger);
            }
        } else {
            //スレッド外のメッセージ");
            await this.handleNewTopLevelMessage(message, logger);
        }
    }

    // 編集投稿時はこの関数で処理する
    async handleEditedMessage (messageRaw, logger) {
        logger.info("handleEditedMessageが実行されました");
        let msg = '';
        const message = messageRaw.message;
        const channelId = messageRaw.channel;
        
        if (this.isInThread(message)) {
            // スレッド投稿を編集した時
        } else if (this.isDiary(message)) {
            // 日記編集時
            try {
                logger.info("diaryService.processUpdateDiaryを実行");
                msg = await this.diaryService.processUpdateDiary(message, channelId);
                logger.info("diaryService.processUpdateDiaryが終了:" + JSON.stringify(msg));
            } catch (error) {
                logger.error(error.stack);
                msg = error.toString();
            }

            await this.slackApiAdaptor.sendDirectMessage(msg, message.user);
        }
    }

    // スレッド内部かつ、新規ポストかつ、ボットメンション時
    // 現状疑似スラッシュコマンドのみ
    async handleNewThreadMentionMessage (message, logger) {
        logger.info("handleNewThreadMentionMessageが実行されました");
        let msg = '';

        // /AIフィードバック
        if (message.text.match(RegexConst.THREADCOMMANDS.AI_FEEDBACK)) {
            try {
                logger.info("diaryService.aiFeedbackを実行");
                msg = await this.diaryService.generateFeedback(message);
                logger.info("diaryService.aiFeedbackが終了:" + JSON.stringify(msg));
            } catch (error) {
                logger.error(error.stack);
                msg = error.toString();
            }
        }
        // SlackPresenter用のパラメータ値取得
        const { channel, ts } = message;
        await this.slackApiAdaptor.sendThreadMessage (msg, channel, ts);
    }

    // スレッド内部かつ、新規ポストかつ、ボットメンションではない
    // ・
    async handleNewThreadMessage (message, logger) {
        logger.info("handleNewThreadMessageが実行されました");

        // 壁スレッドの中身だった場合ThreadServiceを使ってDBにtextを保存する
        return this.threadService.newThreadReply(message, logger);
    }

    // スレッド外部かつ、新規ポスト時
    async handleNewTopLevelMessage (message, logger) {
        logger.info("handleTopLevelNewMessageが実行されました");
        let msg = '';

        // 正規表現で日記を検知する
        if (this.isDiary(message)) {
            // 日記新規投稿時
            try {
                logger.info("diaryService.newDiaryEntryを実行");
                msg = await this.diaryService.processNewDiaryEntry(message);
                logger.info("diaryService.newDiaryEntryが終了:" + msg);

            } catch (error) {
                logger.error(error.stack);
                msg = error.toString();
            }

            await this.slackApiAdaptor.sendDirectMessage(msg, message.user);
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