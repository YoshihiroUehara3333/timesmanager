const { PostMessage } = require("../slack/SlackApiRequest");

class HandlerBase {
    constructor({
        slackApiAdaptor
    }){
        this.slackApiAdaptor   = slackApiAdaptor;
    }

    async handleDefault(body){
        return undefined;
    }

    async execute(handler, userId, body, logger){
        let slackRequest;
        try {
            slackRequest = await handler(body);
        }
        catch (error) {
            logger.error(error.stack);
            slackRequest = new PostMessage(userId, error.toString());
        } 
        finally {
            if (slackRequest) {
                await this.slackApiAdaptor.send(slackRequest);
            }
        }
    }
}

exports.HandlerBase = HandlerBase;