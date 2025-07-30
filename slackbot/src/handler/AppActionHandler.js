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
        this.diaryService      = diaryService;
        this.taskService       = taskService;
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            [`${ModalConst.ACTION_ID.DIARY.MANAGE}`]        : this.handleDiaryManage.bind(this),
            [`${ModalConst.ACTION_ID.WORKREPORT.CREATE}`]   : this.handleWorkReportCreate.bind(this),
            [`${ModalConst.ACTION_ID.WORKREPORT.UPDATE}`]   : this.handleWorkReportUpdate.bind(this),
            [`${ModalConst.ACTION_ID.WORKREPORT.FINISH}`]   : this.handleWorkReportFinish.bind(this),
            'default'                                       : this.handleDefault.bind(this)
        }
    }

    async handle (body, logger) {
        const actions = body.actions[0];
        logger.info(`action_id:${actions.action_id}`);
        const handler = this.dispatcher[actions.action_id] || this.dispatcher['default'];

        const userId = message.user;
        let slackRequest;
        try {
            slackRequest = await handler(body, logger);
        }
        catch (error) {
            logger.error(error.stack);
            slackRequest = new PostMessage(userId, error.toString());
        }
        finally {
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        }
    }

    async handleDiaryManage(body, logger){
        logger.info("handleDiaryManageが実行されました");
        const form = this.diaryService.setDiaryManageFormData(body);
        return;
    }

    async handleWorkReportCreate(body, logger){
        logger.info("handleWorkReportCreateが実行されました");
        return;
    }
    
    async handleWorkReportUpdate(body, logger){
        logger.info("handleWorkReportUpdateが実行されました");
        const params = await this.taskService.updateTask(body);

        return new ViewsOpen(
            command.trigger_id,
            TaskInputModal(params)
        )
    }

    async handleWorkReportFinish(body, logger){
        logger.info("handleWorkReportFinishが実行されました");
        return;
    }
}

exports.AppActionHandler = AppActionHandler;