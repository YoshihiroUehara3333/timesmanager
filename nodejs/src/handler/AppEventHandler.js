// app.event受け取り時

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
        const eventType = event.type;
        const handler = this.dispatcher[eventType];

        handler(event, logger);
    }

    async updateAppHome(event, logger){

    }
};

exports.AppEventHandler = AppEventHandler;