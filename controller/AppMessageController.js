// app.message受け取り時

// モジュール読み込み
const { SlackConstants } = require('../constants/SlackConstants');

class AppMessageController {
    constructor (diaryService, twitterService, slackPresenter) {
        this.diaryService = diaryService;
        this.twitterService = twitterService;
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
        const text = message.text;

        // スレッド判別
        const isThreadReply = !!message.thread_ts;
        if(isThreadReply) {
            logger.info("スレッド内のメッセージです。");
            if (text.match(`<@${SlackConstants.ID.botUserId}>`)) {
                // スレッド内ボットメンションは現状疑似スラッシュコマンドのみ
                await this.handleNewThreadMentionMessage(message, logger, client);
            } else {
                // スレッド内部だった場合
                await this.handleNewThreadMessage(message, logger, client);
            }
        } else {
            logger.info("スレッド外のメッセージです。");
            await this.handleNewTopLevelMessage(message, logger, client);
        }
    };

    // 編集投稿時はこの関数で処理する
    async handleEditedMessage (message, logger, client) {
        logger.info("handleEditedMessageが実行されました");
        let msg = 'handleEditedMessage初期値';

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

    // スレッド内部かつ、新規ポストかつ、ボットメンション時
    // 現状疑似スラッシュコマンドのみ
    async handleNewThreadMentionMessage (message, logger, client) {
        logger.info("handleNewThreadMentionMessageが実行されました");
        let msg = 'handleNewThreadMentionMessage初期値';

        const text = message.text;
        // /AIフィードバック
        if (text.match(/\/AIフィードバック/)) {
            const channel = message.channel;
            const threadTs = message.ts;
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

    // スレッド内部かつ、新規ポストかつ、ボットメンションではない
    // ・
    async handleNewThreadMessage (message, logger, client) {
        logger.info("handleNewThreadMessageが実行されました");
        let msg = 'handleMentionedMessage初期値';

        // 壁スレッドの中身だった場合TwitterServiceを使ってDBにtextを保存する
        // 未実装
        return;
    }

    // スレッド外部かつ、新規ポスト時
    async handleNewTopLevelMessage (message, logger, client) {
        logger.info("handleTopLevelNewMessageが実行されました");
        let msg = 'handleTopLevelMessage初期値';

        // messageから各情報取得
        const userId = message.user;
        const text = message.text;
        // 正規表現で日記と壁を検知する
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

        } else if (text.match(/\*【壁】\*([^\n]+)/)) {
            // 壁投稿時
            try {
                logger.info("twitterService.newThreadEntryを実行");
                msg = await this.twitterService.newThreadEntry(message, client);
                logger.info("twitterService.newThreadEntryが終了:" + JSON.stringify(msg));

                await this.slackPresenter.sendDirectMessage(client, msg, userId);
                logger.info("Twitter情報DB保存成功");
            } catch (error) {
                console.error("DM送信時エラー:", error);
            }
        }
    }
};

exports.AppMessageController = AppMessageController;