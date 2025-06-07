// app.command受け取り時

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');

class AppCommandController {
    threadService;
    workReportService;
    slackPresenter;

    constructor(threadService, workReportService, slackPresenter){
        this.threadService = threadService;
        this.workReportService = workReportService;
        this.slackPresenter = slackPresenter;

        this.commandHandlers = {
            '/makethread'   : this.handleMakethread.bind(this),
            '/newtask'      : this.handleNewTask.bind(this),
            '/warmup'       : this.handleWarmUp.bind(this)
        }
    };

    async dispatchAppCommand (command, logger, client) {
        logger.info(`command:${command.command}`);

        const appCommandHandler = this.commandHandlers[command.command] || this.commandHandlers['default'];
        return appCommandHandler(message, logger, client);
    };

    // /makethread実行時
    async handleMakethread (command, logger, client) {
        try {
            let view = await this.threadService.processNewThreadEntry(command, client);
            await this.slackPresenter.openView (client, view, command.trigger_id);
            
        } catch (error) {
            logger.error(error);
            await this.slackPresenter.sendDirectMessage(client, error.toString(), command.user);
        }
    }

    // /newtask実行時
    async handleNewTask (command, logger, client) {
        try {
            let view = await this.workReportService.processNewTask(command, client);
            await this.slackPresenter.openView (client, view, command.trigger_id);
            
        } catch (error) {
            logger.error(error);
            await this.slackPresenter.sendDirectMessage(client, error.toString(), command.user);
        }
    }

    // /warmup実行時
    async handleWarmUp (command, logger, client) {
        const msg = '/warmupが実行されました。'
        await this.slackPresenter.sendDirectMessage(client, msg, command.user);
    }

};

exports.AppCommandController = AppCommandController;