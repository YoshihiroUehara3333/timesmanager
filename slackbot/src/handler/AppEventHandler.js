// app.event受け取り時

const { AppHomeView } = require("../blockkit/AppHomeView");
const { ViewsPublish, PostMessage } = require("../slack/SlackApiRequest");
const { HandlerBase } = require("./HandlerBase");

class AppEventHandler extends HandlerBase{
    constructor
    ({
        slackApiAdaptor
    }){
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            'app_home_opened' : this.updateAppHome.bind(this),
            'default'         : this.handleDefault.bind(this)
        }
    }

    async handle(body, event, logger) {
        const handler = this.dispatcher[event.type] || this.dispatcher['default'];

        const userId = command.user_id;
        let slackRequest;
        try {    
            slackRequest = await handler(event, logger);
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

    async updateAppHome(event, logger){
        logger.info('updateAppHomeを実行');

        return new ViewsPublish(
            event.user,
            AppHomeView()
        )
    }
};

exports.AppEventHandler = AppEventHandler;