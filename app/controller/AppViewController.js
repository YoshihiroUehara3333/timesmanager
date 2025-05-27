const { ModalConst } = require('../constants/ModalConst');

class AppViewController {
    constructor (threadService) {
        this.threadService = threadService;
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
    async handleMakeThreadModal(body, view, client) {
        const userId = body.user.id;
        const metadata = JSON.parse(view.private_metadata);
        const { channel_id, thread_ts, date } = metadata;

        const title = view.state.values.title_block.title_input.value;
        const content = view.state.values.content_block.content_input.value;

        // スレッドへの返信
        const result = await client.chat.postMessage({
            channel: channel_id,
            thread_ts: thread_ts,
            text: `📝 <@${userId}> さんの作業予定\n*タイトル:* ${title}\n*内容:* ${content}`
        });

        // 必要であればDBに保存（例: DynamoDB）
        // await dynamo.put({ ... });
    }
}

exports.AppViewController = AppViewController;