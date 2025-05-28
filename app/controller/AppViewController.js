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
        
        // メタデータ取得
        const user_id = body.user.id;
        const { channel_id, thread_ts } = JSON.parse(view.private_metadata);

        // モーダル入力値を取得
        const work_plan     = view.state.values.content_block.work_plan.value || '';
        const selected_time = view.state.values.RVSjM.timepicker.selected_time;

        // スレッドへ返信
        const json = {
            channel     : channel_id,
            thread_ts   : thread_ts,
            text        : "作業計画",
            mrkdwn      : true,
            blocks      : WorkPlanBlock(user_id, work_plan, selected_time),
        };
        const reply = await client.chat.postMessage(json);

        // 必要であればDBに保存（例: DynamoDB）
        // await dynamo.put({ ... });
        this.threadService.
    }
}

exports.AppViewController = AppViewController;