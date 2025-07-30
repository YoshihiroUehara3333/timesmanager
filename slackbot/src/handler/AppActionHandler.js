// app.action用Controllerクラス

//モジュール読み込み
const { HandlerBase } = require('./HandlerBase');
const { ModalConst } = require('../constants/ModalConst');
const { PostMessage, ViewsOpen } = require('../slack/SlackApiRequest');

const { TaskInputModal } = require('../blockkit/TaskInputModal');

class AppActionHandler extends HandlerBase{
    constructor ({
        diaryService,
        taskService,
        slackApiAdaptor
    }) {
        super({slackApiAdaptor});

        this.diaryService      = diaryService;
        this.taskService       = taskService;

        this.dispatcher = {
            [`${ModalConst.ACTION_ID.DAILYREPORT.MANAGE}`] : this.handleDiaryManage.bind(this),
            [`${ModalConst.ACTION_ID.TASK.CREATE}`]        : this.handleWorkReportCreate.bind(this),
            [`${ModalConst.ACTION_ID.TASK.UPDATE}`]        : this.handleWorkReportUpdate.bind(this),
            [`${ModalConst.ACTION_ID.TASK.FINISH}`]        : this.handleWorkReportFinish.bind(this),
            'default'                                      : this.handleDefault.bind(this)
        }
    }

    async handle (body, logger) {
        const actions = body.actions[0];
        logger.info(`action_id:${actions.action_id}`);
        const handler = this.dispatcher[actions.action_id] || this.dispatcher['default'];
        const userId = body.user_id;

        logger.info(`${handler.name}を実行`);
        await this.execute(handler, userId, body, logger);
    }

    async handleDiaryManage(body){
        const form = this.diaryService.setDiaryManageFormData(body);
        return;
    }
    
    async handleWorkReportUpdate(body){
        const params = await this.taskService.updateTask(body);

        return new ViewsOpen(
            body.trigger_id,
            TaskInputModal(params)
        )
    }
}

exports.AppActionHandler = AppActionHandler;