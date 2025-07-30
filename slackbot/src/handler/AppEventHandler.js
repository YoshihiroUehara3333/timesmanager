// app.event受け取り時

const { AppHomeView } = require("../blockkit/AppHomeView");
const { ViewsPublish, PostMessage } = require("../slack/SlackApiRequest");
const { HandlerBase } = require("./HandlerBase");

class AppEventHandler extends HandlerBase{
    constructor({
        slackApiAdaptor
    }){
        super({slackApiAdaptor});

        this.dispatcher = {
            'app_home_opened' : this.updateAppHome.bind(this),
            'default'         : this.handleDefault.bind(this)
        }
    }

    async handle(body, event, logger) {
        const userId = event.user;
        const handler = this.dispatcher[event.type] || this.dispatcher['default'];

        logger.info(`${handler.name}を実行`);
        await this.execute(handler, userId, body, logger);
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

    async updateAppHome(body){
        const event = this.getEventFromBody(body);
        return new ViewsPublish(
            event.user,
            AppHomeView()
        )
    }

    getEventFromBody(body){
        return body.event;
    }
};

exports.AppEventHandler = AppEventHandler;