// app.command受け取り時

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');
const { PostMessage, ViewsOpen } = require('../adaptor/slack/SlackApiRequest');

class AppCommandController {
    constructor(threadService, workReportService, slackApiAdaptor){
        this.threadService     = threadService;
        this.workReportService = workReportService;
        this.slackApiAdaptor   = slackApiAdaptor;

        // dispatch用のList
        this.commandDispatcher = {
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this)
        }
    }

    async dispatchAppCommand (command, logger) {
        logger.info(`command:${command.command}`);

        const appCommandHandler = this.commandDispatcher[command.command];
        try {
            const slackRequest = appCommandHandler(command, logger);
            await this.slackApiAdaptor.send(slackRequest);
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(message.user, error.toString())
            );
        }
    }

    // /makethread実行時
    async handleMakethread (command, logger) {
        logger.debug(`handleMakethreadを実行`);
        try {
            let view = await this.threadService.processNewThreadEntry(command);
            return await this.slackApiAdaptor.openView(view, command.trigger_id);
            
        } catch (error) {
            logger.error(error.data);
            await this.slackApiAdaptor.sendDirectMessage(error.toString(), command.user_id);
        }
    }

    // /newtask実行時
    async handleNewTask (command, logger) {
        try {
            let view = await this.workReportService.processNewTaskCommand(command);
            await this.slackApiAdaptor.openView(view, command.trigger_id);
            
        } catch (error) {
            logger.error(error);
            await this.slackApiAdaptor.sendDirectMessage(error.toString(), command.user_id);
        }
    }

    // /warmup実行時
    async handleWarmUp (command, logger) {
        try {
            const msg = '/warmupが実行されました。'
            await this.slackApiAdaptor.sendDirectMessage(msg, command.user_id);
        } catch (error) {
            logger.error(error.data);
            await this.slackApiAdaptor.sendDirectMessage(error.toString(), command.user_id);
        }
    }

};

exports.AppCommandController = AppCommandController;