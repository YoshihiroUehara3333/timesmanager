// app.message受け取り時

// モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');
const { RegexConst } = require('../constants/RegexConst');

class AppMessageController {
    constructor (diaryService, threadService, slackPresenter) {
        this.diaryService = diaryService;
        this.threadService = threadService;
        this.slackPresenter = slackPresenter;
    };

    // subtypeによってmessageの構造が異なる為まずsubtypeで処理を分ける
    async handleAppMessage (message, logger, client) {
        logger.info("handleAppMessageが実行されました");

        const isEdited = message.subtype === 'message_changed';
        if (isEdited) {
            await this.handleEditedMessage(message, logger, client);
        } else {
            await this.handleNewMessage(message, logger, client);
        }
    };

    // 新規投稿時はこの関数で処理する
    // ・スレッドの内部/外部
    // ・メンション付きかどうか
    // 上記判定を行い、別関数に処理を移譲する。
    async handleNewMessage (message, logger, client) {
        logger.info("handleNewMessageが実行されました");

        // messageからtext取得
        const { text, thread_ts } = message;

        // スレッド判別
        const isInThread = !!thread_ts;
        if(isInThread) {
            logger.info("スレッド内のメッセージです。");
            if (text.match(`<@${SlackConst.ID.botUserId}>`)) {
                // スレッド内ボットメンションは現状疑似スラッシュコマンドのみ
                await this.handleNewThreadMentionMessage(message, logger, client);
            } else {
                // スレッド内部だった場合
                await this.handleNewThreadMessage(message, logger, client);
            }
        } else {
            //スレッド外のメッセージです。");
            await this.handleNewTopLevelMessage(message, logger, client);
        }
    };

    // 編集投稿時はこの関数で処理する
    async handleEditedMessage (message, logger, client) {
        logger.info("handleEditedMessageが実行されました");

        const { text, user } = message.message;
        if (text.match(RegexConst.DATE)) {
            // 日記編集時
            try {
                logger.info("diaryService.updateDiaryを実行");
                const msg = await this.diaryService.updateDiary(message, client);
                logger.info("diaryService.updateDiaryが終了:" + JSON.stringify(msg));

                await this.slackPresenter.sendDirectMessage(client, msg, user);
                logger.info("DM送信成功");
            } catch (error) {
                await this.slackPresenter.sendDirectMessage(client, error.toString(), user);
            }
        }
    };

    // スレッド内部かつ、新規ポストかつ、ボットメンション時
    // 現状疑似スラッシュコマンドのみ
    async handleNewThreadMentionMessage (message, logger, client) {
        logger.info("handleNewThreadMentionMessageが実行されました");

        const {text, channel, ts} = message;
        // /AIフィードバック
        if (text.match(RegexConst.COMMANDS.AI_FEEDBACK)) {
            try {
                logger.info("diaryService.aiFeedbackを実行");
                const msg = await this.diaryService.generateFeedback(message);
                logger.info("diaryService.aiFeedbackが終了:" + JSON.stringify(msg));

                await this.slackPresenter.sendThreadMessage (client, msg, channel, ts);
                logger.info("フィードバック送信成功");
            } catch (error) {
                await this.slackPresenter.sendThreadMessage (client, error.toString(), channel, ts);
            }
        }
    }

    // スレッド内部かつ、新規ポストかつ、ボットメンションではない
    // ・
    async handleNewThreadMessage (message, logger, client) {
        logger.info("handleNewThreadMessageが実行されました");

        // 壁スレッドの中身だった場合ThreadServiceを使ってDBにtextを保存する
        return this.threadService.newThreadReply(message, logger, client);
    }

    // スレッド外部かつ、新規ポスト時
    async handleNewTopLevelMessage (message, logger, client) {
        logger.info("handleTopLevelNewMessageが実行されました");

        // messageから各情報取得
        const {user, text} = message;
        // 正規表現で日記を検知する
        if (text.match(RegexConst.DATE)) {
            // 日記新規投稿時
            try {
                logger.info("diaryService.newDiaryEntryを実行");
                const msg = await this.diaryService.newDiaryEntry(message, client);
                logger.info("diaryService.newDiaryEntryが終了:" + msg);

                await this.slackPresenter.sendDirectMessage(client, msg, user);
                logger.info("DM送信成功");
            } catch (error) {
                await this.slackPresenter.sendDirectMessage(client, error.toString(), user);
            }
        }
    }
};

exports.AppMessageController = AppMessageController;