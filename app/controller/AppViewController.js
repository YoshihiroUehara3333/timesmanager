const { ModalConst } = require('../constants/ModalConst');

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
        const userId = body.user.id;
        const { channel_id, thread_ts } = JSON.parse(view.private_metadata);

        const content = view.state.values.content_block.content_input.value || '';

        // スレッドへの返信
        const msg = `<@${userId}>\n📝作業計画\n${content}`;
        const result = 
            await this.slackPresenter.sendThreadMessage(client, msg, channel_id, thread_ts);

        // 必要であればDBに保存（例: DynamoDB）
        // await dynamo.put({ ... });
    }
}

exports.AppViewController = AppViewController;