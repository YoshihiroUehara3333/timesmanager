// app.command受け取り時
const { SlackConst } = require('../constants/SlackConst');

//モジュール読み込み
require('date-utils');


class AppCommandController {
    constructor(threadService){
        this.threadService = threadService;
    };

    async handleAppCommand (command, logger, client) {
        logger.info('受信コマンド出力；' + JSON.stringify((command)));

        const commandName = command.command;
        console.log(`command:${commandName}`);

        switch (commandName) {
            case SlackConst.COMMAND.makeThread:
                return await this.handleMakethread(command, logger, client);
            default:
                break;
        }
    };

    // /makethread実行時
    async handleMakethread (command, logger, client) {
        const { user_id, channel_id } = command;
        const view = this.threadService.newThreadEntry(user_id, channel_id, client);

        console.log(view);
        // モーダルを開く
        await client.views.open({
            trigger_id: command.trigger_id,
            view: view, 
        });
    }
};


exports.AppCommandController = AppCommandController;