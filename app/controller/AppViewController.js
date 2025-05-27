const { ModalConst } = require('../constants/ModalConst');
const { WorkPlanBlock } = require('../blockkit/WorkPlanBlock');

class AppViewController {
    constructor (threadService, slackPresenter) {
        this.threadService = threadService;
        this.slackPresenter = slackPresenter;
    };

    // dispatch
    async handleModalCallback(body, view, client) {
        const callbackId = view.callback_id;
        
        switch (callbackId) {
            case ModalConst.CALLBACK_ID.MAKETHREAD:
                return await this.handleMakeThreadModal(body, view, client);
            default:
                break;
        }
    }

    // /makethreadモーダル送信時の処理
    async handleMakeThreadModal(body, view, client){
        const user_id = body.user.id;
        const { channel_id, thread_ts } = JSON.parse(view.private_metadata);

        const content = view.state.values.content_block.content_input.value || '';

        // スレッドへの返信
        const msg = `<@${user_id}>\n📝作業計画\n${content}`;
        const json = {
            channel: channel_id,
            text: msg,
            thread_ts: thread_ts,
            mrkdwn: true,
            blocks: WorkPlanBlock(userId, content),
        };
        console.log(JSON.stringify(json));

        const result = await client.chat.postMessage(json);

        // 必要であればDBに保存（例: DynamoDB）
        // await dynamo.put({ ... });
    }
}

exports.AppViewController = AppViewController;