// app.command受け取り時

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');
const { PostMessage, ViewsOpen } = require('../adaptor/slack/SlackApiRequest');

class AppCommandController {
    constructor(threadService, workReportService, slackApiAdaptor){
        this.threadService     = threadService;
        this.workReportService = workReportService;
        this.slackApiAdaptor   = slackApiAdaptor;

        this.appCommandDispatcher = {
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this)
        }
    }

    async handleAppCommand (command, logger) {
        logger.info(`command:${command.command}`);

        const handler = this.appCommandDispatcher[command.command];
        try {
            const slackRequest = await handler(command, logger);
            await this.slackApiAdaptor.send(slackRequest);
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(command.user_id, error.toString())
            );
        }
    }

    // /makethread実行時
    async handleMakethread (command, logger) {
        logger.debug(`handleMakethreadを実行`);
        return await this.threadService.processNewThreadEntry(command);
    }

    // /newtask実行時
    async handleNewTask (command, logger) {
        logger.debug(`handleMakethreadを実行`);
        return await this.workReportService.processNewTaskCommand(command);
    }

    // /warmup実行時
    async handleWarmUp (command, logger) {
        return new PostMessage(command.user_id, 'warmupが実行されました');
    }
};

exports.AppCommandController = AppCommandController;