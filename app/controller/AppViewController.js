//モジュール読み込み
require('date-utils');
const { ModalConst } = require('../constants/ModalConst');
const { WorkPlanBlock } = require('../blockkit/WorkPlanBlock');

class AppViewController {
    CALLBACK_ID = ModalConst.CALLBACK_ID;

    constructor (threadService, workReportService, slackApiAdaptor) {
        this.threadService      = threadService;
        this.workReportService  = workReportService;
        this.slackApiAdaptor    = slackApiAdaptor;

        // callback id dispatcher
        this.callBackHandlers = {
            [`${this.CALLBACK_ID.NEWTASK}`]  : this.handleNewTaskModalCallBack.bind(this),
            'default'                        : this.handleDefault.bind(this),
        }
    };

    // dispatch
    async dispatchModalCallback(body, view, logger) {
        const callbackId = view.callback_id;
        logger.info(`callbackId:${callbackId}`);
        
        const callBackHandler = this.callBackHandlers[callbackId] || this.callBackHandlers['default'];
        return callBackHandler(body, view, logger);
    }

    // 作業記録モーダル初回送信時の処理
    async handleNewTaskModalCallBack(body, view, logger) {
        logger.info('handleNewTaskModalCallBackを実行');
        // メタデータ取得
        const metadata  = JSON.parse(view.private_metadata);
        const blocks    = this.workReportService.processNewTaskEntry(body, view);
        const reply = await this.slackApiAdaptor.sendtBlockMessage(msg, metadata.channel_id, metadata.thread_ts, blocks);
        // 必要であればDBに保存（例: DynamoDB）
        await this.workReportService.processNewTaskSubmission(body, view);
    }

    async handleDefault (body, view, logger) {
        
    }
}

exports.AppViewController = AppViewController;