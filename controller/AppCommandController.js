// app.command受け取り時

class AppCommandController {
    constructor(){};

    async handleAppCommand (event , context, logger, client) {
        if (context.retryNum) return; // リトライ以降のリクエストは弾く
        logger.info('受信イベント出力；' + JSON.stringify((event)));
    };
};

xports.AppCommandController = AppCommandController;