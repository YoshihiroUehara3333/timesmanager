// app.command受け取り時

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');

class AppCommandController {
    constructor(threadService, slackPresenter){
        this.threadService = threadService;
        this.slackPresenter = slackPresenter;
    };

    async dispatchAppCommand (command, logger, client) {
        const commandName = command.command;
        logger.info(`command:${commandName}`);

        switch (commandName) {
            case SlackConst.COMMAND.makeThread:
                return await this.handleMakethread(command, logger, client);
                
            case SlackConst.COMMAND.warmUp:
                return; // 何もしない

            default:
                return;
        }
    };

    // /makethread実行時
    async handleMakethread (command, logger, client) {
        try {
            let view = await this.threadService.processNewThreadEntry(command, client);
            await client.views.open({
                trigger_id : command.trigger_id,
                view       : view,
            });
        } catch (error) {
            logger.error(error);
            await this.slackPresenter.sendDirectMessage(client, error.toString(), message.user);
        }
    }
};

exports.AppCommandController = AppCommandController;