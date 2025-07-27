// Slack Clientのラッパー
//

class SlackApiAdaptor {
    constructor (client) {
        this.client = client;

        this.methodDispatcher = {
            'PostMessage'  : this.postMessage.bind(this),
            'GetPermalink' : this.getPermalink.bind(this),
            'ViewsOpen'    : this.viewsOpen.bind(this)
        }
    }

    async send(request) {
        const method = this.methodDispatcher[request.constructor.name];
        if (!method) {
            throw new Error(`Unsupported request type: ${request.constructor.name}`);
        }
        return await method(request);
    }

    async postMessage (request) {
        try {
            return await this.client.chat.postMessage(request.toPayload());
        } catch (error) {
            throw new Error (error.message, {cause: error});
        }
    }

    async getPermalink(request) {
        try {
            const getResult = await this.client.chat.getPermalink(request.toPayload());
            return getResult.permalink;
        } catch (error) {
            throw new Error (error.message, {cause: error});
        }
    }

    async viewsOpen (request) {
        try {
            return await this.client.views.open(request.toPayload());
        } catch (error) {
            throw new Error (error.message, {cause: error});
        }
    }
}

exports.SlackApiAdaptor = SlackApiAdaptor;

