// app.event受け取り時

class AppEventHandler {
    constructor
    ({
        slackApiAdaptor
    }){
        this.slackApiAdaptor   = slackApiAdaptor;

        this.dispatcher = {
            [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]   : this.handleMakethread.bind(this),
            [`${SlackConst.APPCOMMANDS.NEWTASK}`]      : this.handleNewTask.bind(this),
            [`${SlackConst.APPCOMMANDS.WARMUP}`]       : this.handleWarmUp.bind(this),
            [`${SlackConst.APPCOMMANDS.MANAGEDIARY}`]  : this.handleManageDiary.bind(this)
        }
    }

    async handle(event, logger) {
        
    }
};

exports.AppEventHandler = AppEventHandler;