//モジュール読み込み
require('date-utils');
const { ModalConst } = require('../constants/ModalConst');
const { PostMessage } = require('../slack/SlackApiRequest');
const { HandlerBase } = require('./HandlerBase');
const { TaskInputModal } = require('../blockkit/TaskInputModal');

class AppViewHandler extends HandlerBase {
    CALLBACK_ID = ModalConst.CALLBACK_ID;

    constructor ({
        threadService, 
        workReportService, 
        slackApiAdaptor
    }) {
        this.threadService      = threadService;
        this.workReportService  = workReportService;
        this.slackApiAdaptor    = slackApiAdaptor;

        this.dispatcher = {
            [`${this.CALLBACK_ID.NEWTASK}`]  : this.handleNewTaskModalCallback.bind(this),
            'default'                        : this.handleDefault.bind(this)
        }
    }

    async handle(view, logger){
        const callbackId = view.callback_id;
        logger.info(`callbackId:${callbackId}`);
        
        let slackRequest;
        try {
            const handler = this.dispatcher[callbackId] || this.dispatcher['default'];
            slackRequest = await handler(view, logger);
        } 
        catch (error) {
            logger.error(error.stack);
            slackRequest = new PostMessage(
                JSON.parse(view.private_metadata).user_id,
                error.toString()
            )
        }
        finally {
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        }
    }

    async handleNewTaskModalCallback(view, logger) {
        logger.info('handleNewTaskModalCallBackを実行');
        let metadata = JSON.parse(view.private_metadata);

        // 入力データをBlocksとして返信
        const params = await this.workReportService.setWorkPlanBlockParams(view);
        const postResponse = await this.slackApiAdaptor.send(new PostMessage(
            metadata.channel_id, 
            'blocks送信',  
            metadata.thread_ts, 
            WorkPlanBlock(params)
        ));
        logger.info(`post結果:${JSON.stringify(postResponse)}`);

        // 入力データをDBに保存
        return await this.workReportService.processNewTaskSubmition(view);
    }
}

exports.AppViewHandler = AppViewHandler ;