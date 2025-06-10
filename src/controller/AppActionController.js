// app.action用Controllerクラス

//モジュール読み込み
const { ModalConst } = require('../constants/ModalConst');

class AppActionController {
    constructor (workReportService, slackApiAdaptor) {
        this.workReportService = workReportService;
        this.slackApiAdaptor   = slackApiAdaptor;

        // dispatch用のList
        this.actionIdDispatcher = {
            [`${ModalConst.ACTION_ID.WORKREPORT.UPDATE}`]   : this.handleWorkReportUpdate.bind(this),
            [`${ModalConst.ACTION_ID.WORKREPORT.FINISH}`]   : this.handleWorkReportFinish.bind(this),
            'default'                                       : this.handleDefault.bind(this),
        }
    }

    // actions.action_idによってメソッド振り分け
    async dispatchActionId (body, logger) {
        const actions = body.actions;

        logger.info(`action_id:${actions.action_id}`);

        const actionIdHandler = 
            this.actionIdDispatcher[actions.action_id] 
            || this.actionIdDispatcher['default'];

        return actionIdHandler(body, logger);
    }

    async handleWorkReportUpdate(body, logger){
        return;
    }

    async handleWorkReportFinish(body, logger){
        return;
    }

    async handleDefault(body, logger){
        return;
    }
}

exports.AppActionController = AppActionController;