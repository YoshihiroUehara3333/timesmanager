// app.action用Controllerクラス

//モジュール読み込み
const { ModalConst } = require('../constants/ModalConst');
const { PostMessage } = require('../slack/SlackApiRequest');

class AppActionHandler {
    constructor ({
        workReportService,
        slackApiAdaptor
    }) {
        this.workReportService = workReportService;
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            [`${ModalConst.ACTION_ID.WORKREPORT.CREATE}`]   : this.handleWorkReportUpdate.bind(this),
            [`${ModalConst.ACTION_ID.WORKREPORT.UPDATE}`]   : this.handleWorkReportUpdate.bind(this),
            [`${ModalConst.ACTION_ID.WORKREPORT.FINISH}`]   : this.handleWorkReportFinish.bind(this),
        }
    }

    async handle(body, logger) {
        const actions = body.actions[0];
        logger.info(`action_id:${actions.action_id}`);

        const handler = this.dispatcher[actions.action_id];
        try {
            const result = await handler(body, logger);
            if (result?.slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(command.user_id, error.toString())
            );
        }
    }

    async handleWorkReportUpdate(body, logger){
        logger.info("handleWorkReportUpdateが実行されました");
        return;
    }

    async handleWorkReportFinish(body, logger){
        logger.info("handleWorkReportFinishが実行されました");
        return;
    }

    async handleDefault(body, logger){
        logger.info("handleDefaultが実行されました");
        return;
    }
}

exports.AppActionHandler = AppActionHandler;