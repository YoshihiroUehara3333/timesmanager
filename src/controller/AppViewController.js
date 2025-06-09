//モジュール読み込み
require('date-utils');
const { ModalConst } = require('../constants/ModalConst');


class AppViewController {
    CALLBACK_ID = ModalConst.CALLBACK_ID;

    constructor (threadService, workReportService, slackApiAdaptor) {
        this.threadService      = threadService;
        this.workReportService  = workReportService;
        this.slackApiAdaptor    = slackApiAdaptor;

        // callback id dispatcher
        this.callBackHandlers = {
            [`${this.CALLBACK_ID.NEWTASK}`]  : this.handleNewTaskModalCallback.bind(this),
            'default'                        : this.handleDefault.bind(this),
        }
    }

    // dispatch
    async dispatchModalCallback(view, logger) {
        const callbackId = view.callback_id;
        logger.info(`callbackId:${callbackId}`);
        
        const callBackHandler = this.callBackHandlers[callbackId] || this.callBackHandlers['default'];
        return callBackHandler(view, logger);
    }

    // 作業記録モーダル初回送信時の処理
    async handleNewTaskModalCallback(view, logger) {
        logger.info('handleNewTaskModalCallBackを実行');
        let metadata = JSON.parse(view.private_metadata);
        let msg = '';

        try {
            // 入力データをBlocksとして返信
            const blocks = await this.workReportService.processNewTaskSubmissionViewData(view, metadata.user_id);
            const postResult = await this.slackApiAdaptor.sendBlockMessage (
                'blocks送信', metadata.channel_id, metadata.thread_ts, blocks
            );
            logger.info(`post結果:${JSON.stringify(postResult)}`);

            // 入力データをDBに保存
            msg = await this.workReportService.saveWorkReportData(view, metadata);
            await this.slackApiAdaptor.sendDirectMessage(msg, metadata.user_id);
            
        } catch (error) {
            logger.error(error);
            await this.slackApiAdaptor.sendDirectMessage(error.toString(), metadata.user_id);
        }
    }

    async handleDefault (view, logger) {
    }
}

exports.AppViewController = AppViewController;