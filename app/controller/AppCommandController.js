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
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this)
        }
    };

    async dispatchAppCommand (command, logger, client) {
        logger.info(`command:${command.command}`);

        const appCommandHandler = this.commandHandlers[command.command] || this.commandHandlers['default'];
        return appCommandHandler(command, logger, client);
    };

    // /makethread実行時
    async handleMakethread (command, logger, client) {
        logger.debug(`handleMakethreadを実行`);
        try {
            let view = await this.threadService.processNewThreadEntry(command, client);
            await this.slackPresenter.openView (client, view, command.trigger_id);
            
        } catch (error) {
            logger.error(error.data);
            await this.slackPresenter.sendDirectMessage(client, error.toString(), command.user_id);
        }
    }

    // /newtask実行時
    async handleNewTask (command, logger, client) {
        try {
            let view = await this.workReportService.processNewTaskCommand(command, client);
            await this.slackPresenter.openView (client, view, command.trigger_id);
            
        } catch (error) {
            logger.error(error);
            await this.slackPresenter.sendDirectMessage(client, error.toString(), command.user_id);
        }
    }

    // /warmup実行時
    async handleWarmUp (command, logger, client) {
        try {
            const msg = '/warmupが実行されました。'
            await this.slackPresenter.sendDirectMessage(client, msg, command.user_id);
        } catch (error) {
            logger.error(error.data);
            await this.slackPresenter.sendDirectMessage(client, error.toString(), command.user_id);
        }
    }

};

exports.AppCommandController = AppCommandController;