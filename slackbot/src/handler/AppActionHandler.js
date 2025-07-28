// app.action用Controllerクラス

//モジュール読み込み
const { ModalConst } = require('../constants/ModalConst');
const { PostMessage } = require('../slack/SlackApiRequest');

class AppActionHandler {
    constructor ({
        diaryService,
        workReportService,
        slackApiAdaptor
    }) {
        this.diaryService      = diaryService;
        this.workReportService = workReportService;
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
        try {
            const result = await handler(body, logger);
            if (result?.slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(body.user.id, error.toString())
            );
        }
    }

    async handleDiaryManage(body, logger){
        logger.info("handleDiaryManageが実行されました");
        const form = this.diaryService.setDiaryManageFormData;
        return;
    }

    async handleWorkReportCreate(body, logger){
        logger.info("handleWorkReportCreateが実行されました");
        return;
    }
    
    async handleWorkReportUpdate(body, logger){
        logger.info("handleWorkReportUpdateが実行されました");
        return await this.workReportService.createNewTask(command, undefined);
    }

    async handleWorkReportFinish(body, logger){
        logger.info("handleWorkReportFinishが実行されました");
        return;
    }

    async handleDefault(body, logger){
        return;
    }
}

exports.AppActionHandler = AppActionHandler;