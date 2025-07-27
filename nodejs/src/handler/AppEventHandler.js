// app.event受け取り時

const { AppHomeView } = require("../blockkit/AppHomeView");
const { ViewsPublish } = require("../slack/SlackApiRequest");

class AppEventHandler {
    constructor
    ({
        slackApiAdaptor
    }){
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            'app_home_opened' : this.updateAppHome.bind(this),
        }
    }

    async handle(event, logger) {
        try {
            const handler = this.dispatcher[event.type];
            const result = await handler(view, logger);
            if (result?.slackRequest) {
                await this.slackApiAdaptor.send(result.slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(new PostMessage(
                JSON.parse(view.private_metadata).user_id,
                error.toString()
            ));
        }
    }

    async updateAppHome(event, logger){
        logger.info('updateAppHomeを実行');

        this.slackApiAdaptor.send(new ViewsPublish({
            userId: event.user_id,
            view  : AppHomeView
        }));
    }
};

exports.AppEventHandler = AppEventHandler;