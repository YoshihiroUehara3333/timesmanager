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
        super({slackApiAdaptor});

        this.diaryService      = diaryService;
        this.threadService     = threadService;
        this.taskService       = taskService;

        this.dispatcher = {
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this),
            [`${SlackConst.APPCOMMANDS.MANAGEDIARY}`]  : this.handleManageDiary.bind(this),
             'default'                                 : this.handleDefault.bind(this)
        }
    }

    async handle(body, logger) {
        const userId = body.command.user;
        const handler = this.dispatcher[command.command] || this.dispatcher['default'];

        logger.info(`${handler.name}を実行`);
        await this.execute(handler, userId, body, logger);
    }

    // /makethread実行時
    async handleMakethread (body) {
        const command = this.getCommandFromBody(body);

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
    async handleNewTask (body) {
        const command = this.getCommandFromBody(body);

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
    async handleWarmUp (body) {
        const command = this.getCommandFromBody(body);

        return new PostMessage(
            command.user_id,
            'warmupが実行されました'
        )
    }

    // /managediary実行時
    async handleManageDiary (body) {
        return undefined;
    }

    getCommandFromBody(body){
        return body.command;
    }
};

exports.AppCommandHandler = AppCommandHandler;