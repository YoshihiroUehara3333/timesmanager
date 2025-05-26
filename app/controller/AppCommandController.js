// app.command受け取り時

//モジュール読み込み
require('date-utils');

class AppCommandController {
    constructor(slackPresenter){
        this.slackPresenter = slackPresenter;
    };

    async handleAppCommand (command, logger, client) {
        logger.info('受信コマンド出力；' + JSON.stringify((command)));

        const commandName = command.command;
        console.log(commandName);

        switch (commandName) {
            case '/makethread':
                return await this.handleMakethread(command, logger, client);
            default:
                break;
        }
    };

    async handleMakethread (command, logger, client) {
        const channel = command.channel_id;
        const userId = command.user_id;

        console.log(channel);
        var date = new Date().toFormat("YYYY-MM-DD");
        const msg = `<@${userId}>\n*【壁】${date}*`;
        this.slackPresenter.sendMessage(client, msg, channel);
    };
};

exports.AppCommandController = AppCommandController;