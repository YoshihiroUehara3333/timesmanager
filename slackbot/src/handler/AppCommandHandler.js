// app.command受け取り時

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');
const { PostMessage, ViewsOpen } = require('../slack/SlackApiRequest');
const { TaskInputModal } = require('../blockkit/TaskInputModal');
const { HandlerBase } = require('./HandlerBase');

class AppCommandHandler extends HandlerBase{
    constructor
    ({
        diaryService,
        threadService, 
        taskService, 
        slackApiAdaptor
    }){
        this.diaryService      = diaryService;
        this.threadService     = threadService;
        this.taskService       = taskService;
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this),
            [`${SlackConst.APPCOMMANDS.MANAGEDIARY}`]  : this.handleManageDiary.bind(this),
             'default'                                 : this.handleDefault.bind(this)
        }
    }

    async handle (command, logger) {
        logger.info(`command:${command.command}`);
        const handler = this.dispatcher[command.command];
        
        let slackRequest;
        try {
            slackRequest = await handler(command, logger);
        } 
        catch (error) {
            logger.error(error.stack);
            slackRequest = new PostMessage(command.user_id, error.toString());
        } 
        finally {
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        }
    }

    // /makethread実行時
    async handleMakethread (command, logger) {
        logger.debug(`handleMakethreadを実行`);
        const thread = await this.threadService.createNewThread(command);
        const params = await this.taskService.createTaskInputModalParams(command, thread);
        if (params) {
            return new ViewsOpen(
                command.trigger_id,
                TaskInputModal(params)
            )
        }
    }

    // /newtask実行時
    async handleNewTask (command, logger) {
        logger.debug(`handleNewTaskを実行`);
        const params = await this.taskService.createTaskInputModalParams(command, undefined);
        if (params) {
            return new ViewsOpen(
                command.trigger_id,
                TaskInputModal(params)
            )
        } else {
            return new PostMessage(
                command.user_id,
                '今日のスレッド情報を取得できませんでした。'
            )
        }
    }

    // /warmup実行時
    async handleWarmUp (command, logger) {
        return new PostMessage(
            command.user_id,
            'warmupが実行されました'
        )
    }

    // /managediary実行時
    async handleManageDiary (command, logger) {
        return undefined;
    }
};

exports.AppCommandHandler = AppCommandHandler;