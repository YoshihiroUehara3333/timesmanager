//モジュール読み込み
require('date-utils');
const { ModalConst } = require('../constants/ModalConst');


class AppViewController {
    CALLBACK_ID = ModalConst.CALLBACK_ID;

    constructor (threadService, workReportService, slackApiAdaptor) {
        this.threadService      = threadService;
        this.workReportService  = workReportService;
        this.slackApiAdaptor    = slackApiAdaptor;

        this.callbackDispatcher = {
            [`${this.CALLBACK_ID.NEWTASK}`]  : this.handleNewTaskModalCallback.bind(this),
            'default'                        : this.handleDefault.bind(this),
        }
    }

    // dispatch
    async handleModalCallback(view, logger) {
        const callbackId = view.callback_id;
        logger.info(`callbackId:${callbackId}`);
        
        try {
            const handler = this.callbackDispatcher[callbackId] || this.callbackDispatcher['default'];
            const slackRequest = handler(view, logger);
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(
                new PostMessage(view.private_metadata.user_id, error.toString())
            )
        }
    }

    // 作業記録モーダル初回送信時の処理
    async handleNewTaskModalCallback(view, logger) {
        logger.info('handleNewTaskModalCallBackを実行');
        let metadata = JSON.parse(view.private_metadata);

        // 入力データをBlocksとして返信
        const blocks = await this.workReportService.processNewTaskSubmissionViewData(view, metadata.user_id);
        const postResponse = await this.slackApiAdaptor.send(new PostRequest(
            metadata.channel_id, 
            'blocks送信',  
            metadata.thread_ts, 
            blocks
        ));
        logger.info(`post結果:${JSON.stringify(postResponse)}`);

        // 入力データをDBに保存
        return await this.workReportService.saveWorkReportData(view, metadata);
    }

    async handleDefault (view, logger) {
    }
}

exports.AppViewController = AppViewController;