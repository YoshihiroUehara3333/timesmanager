// app.command受け取り時

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');
const { PostMessage } = require('../slack/SlackApiRequest');

class AppCommandHandler{
    constructor
    ({
        diaryService,
        threadService, 
        workReportService, 
        slackApiAdaptor
    }){
        this.diaryService      = diaryService;
        this.threadService     = threadService;
        this.workReportService = workReportService;
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this),
            [`${SlackConst.APPCOMMANDS.MANAGEDIARY}`]  : this.handleManageDiary.bind(this)
        }
    }

    async handle (command, logger) {
        logger.info(`command:${command.command}`);

        const handler = this.dispatcher[command.command];
        try {
            const result = await handler(command, logger);
            if (result?.slackRequest) {
                await this.slackApiAdaptor.send(result.slackRequest);
            }
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
        const result = await this.threadService.processNewThreadEntry(command);
        return await this.workReportService.createNewTask(command, result?.thread);
    }

    // /newtask実行時
    async handleNewTask (command, logger) {
        logger.debug(`handleNewTaskを実行`);
        return await this.workReportService.createNewTask(command, undefined);
    }

    // /warmup実行時
    async handleWarmUp (command, logger) {
        return {
            status: true,
            slackRequest: new PostMessage(
                command.user_id,
                'warmupが実行されました'
            )
        }
    }

    // /managediary実行時
    async handleManageDiary (command, logger) {
        return null;
    }
};

exports.AppCommandHandler = AppCommandHandler;