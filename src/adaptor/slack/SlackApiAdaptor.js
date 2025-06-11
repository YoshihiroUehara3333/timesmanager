// Slack Clientのラッパー
//

class SlackApiAdaptor {
    constructor (client) {
        this.client = client;
    }

    // DMを送信する
    async postMessage (request) {
        try {
            return await this.client.chat.postMessage(request.toPayload());
        } catch (error) {
            throw new Error (error.message, {cause: error});
        }
    }

    // Slack投稿のURLを取得する
    async getPermalink(request) {
        try {
            const getResult = await this.client.chat.getPermalink(request.toPayload());
            return getResult.permalink;
        } catch (error) {
            throw new Error (error.message, {cause: error});
        }
    }

    // モーダルを開く
    async viewsOpen (request) {
        try {
            return await this.client.views.open(request.toPayload());
        } catch (error) {
            throw new Error (error.message, {cause: error});
        }
    }
}

exports.SlackApiAdaptor = SlackApiAdaptor;

