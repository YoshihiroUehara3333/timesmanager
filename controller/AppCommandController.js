// app.command受け取り時

//モジュール読み込み
require('date-utils');

class AppCommandController {
    constructor(slackPresenter){
        this.slackPresenter = slackPresenter;
    };

    async handleAppCommand (command, context, logger, client) {
        if (context.retryNum) return; // リトライ以降のリクエストは弾く
        logger.info('受信コマンド出力；' + JSON.stringify((command)));

        const commandName = command.command;

        switch (commandName) {
            case '/makethread':
                return await this.handleMakethread(command, context, logger, client);
            default:
                break;
        }
    };

    async handleMakethread (command, context, logger, client) {
        const channel = command.channel_id;
        var date = new Date().toFormat("YYYY-MM-DD");

        const msg = `*【壁】${date}*`;

        this.slackPresenter.sendMessage(client, msg, channel);
    };
};

exports.AppCommandController = AppCommandController;