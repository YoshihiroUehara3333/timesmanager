// app.message受け取り時

class AppMessageController {
    constructor () {};

    async handleAppMessage (message, context, logger, client) {
        if (context.retryNum) return; // リトライ以降のリクエストは弾く
        logger.info('受信コマンド出力；' + JSON.stringify((message)));

        return;
    };
};

exports.AppMessageController = AppMessageController;