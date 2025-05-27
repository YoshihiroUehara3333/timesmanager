const { ModalConst } = require('../constants/ModalConst');
const { WorkPlanBlock } = require('../blockkit/WorkPlanBlock');

class AppViewController {
    constructor (threadService, slackPresenter) {
        this.threadService = threadService;
        this.slackPresenter = slackPresenter;
    };

    // dispatch
    async handleModalCallback(body, view, logger, client) {
        const callbackId = view.callback_id;
        
        switch (callbackId) {
            case ModalConst.CALLBACK_ID.MAKETHREAD:
                return await this.handleMakeThreadModal(body, view, logger, client);
            default:
                break;
        }
    }

    // /makethreadモーダル送信時の処理
    async handleMakeThreadModal(body, view, logger, client){
        logger.info(`handleMakeThreadModalを実行。`);
        
        const user_id = body.user.id;
        const { channel_id, thread_ts } = JSON.parse(view.private_metadata);

        const work_plan = view.state.values.content_block.work_plan.value || '';
        const seleted_time = `00:00`;

        // スレッドへの返信
        const json = {
            channel: channel_id,
            thread_ts: thread_ts,
            text: "作業計画",
            mrkdwn: true,
            blocks: WorkPlanBlock(user_id, work_plan, seleted_time),
        };
        console.log(JSON.stringify(json));

        const result = await client.chat.postMessage(json);

        // 必要であればDBに保存（例: DynamoDB）
        // await dynamo.put({ ... });
    }
}

exports.AppViewController = AppViewController;