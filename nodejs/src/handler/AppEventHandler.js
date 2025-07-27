// app.event受け取り時

const { AppHomeView } = require("../blockkit/AppHomeView");
const { ViewsPublish, PostMessage } = require("../slack/SlackApiRequest");

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

    async handle(body, event, logger) {
        try {
            const handler = this.dispatcher[event.type];
            const result = await handler(event, logger);
            if (result?.slackRequest) {
                await this.slackApiAdaptor.send(result.slackRequest);
            }
        } catch (error) {
            logger.error(error.stack);
            await this.slackApiAdaptor.send(new PostMessage(
                event.user_id,
                error.toString()
            ));
        }
    }

    async updateAppHome(event, logger){
        logger.info('updateAppHomeを実行');

        this.slackApiAdaptor.send(new ViewsPublish(
            event.user_id,
            AppHomeView
        ));

        return undefined;
    }
};

exports.AppEventHandler = AppEventHandler;