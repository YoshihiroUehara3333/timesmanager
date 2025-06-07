//モジュール読み込み
require('date-utils');
const { ModalConst } = require('../constants/ModalConst');
const { WorkPlanBlock } = require('../blockkit/WorkPlanBlock');

class AppViewController {
    CALLBACK_ID = ModalConst.CALLBACK_ID;

    constructor (threadService, workReportService, slackPresenter) {
        this.threadService      = threadService;
        this.workReportService  = workReportService;
        this.slackPresenter     = slackPresenter;

        this.callBackHandlers = {
            [`${this.CALLBACK_ID.NEWTASK}`]  : this.handleMakeThreadModal.bind(this),
            'default'                        : this.handleDefault.bind(this),
        }
    };

    // dispatch
    async dispatchModalCallback(body, view, logger, client) {
        const callbackId = view.callback_id;
        logger.info(`callbackId:${callbackId}`);
        
        const callBackHandler = this.callBackHandlers[callbackId] || this.callBackHandlers['default'];
        return callBackHandler(body, view, logger, client);
    }

    // 作業記録モーダル初回送信時の処理
    async handleMakeThreadModal(body, view, logger, client) {
        // メタデータ取得
        const metadata  = JSON.parse(view.private_metadata);
        const blocks    = this.workReportService.processNewTaskEntry(body, view, client);
        const reply = await client.chat.postBlockMessage(client, msg, metadata.channel_id, metadata.thread_ts, blocks);
        // 必要であればDBに保存（例: DynamoDB）
        await this.workReportService.processNewWorkReport(body, view, logger, client);
    }

    async handleDefault (body, view, logger, client) {
        
    }
}

exports.AppViewController = AppViewController;