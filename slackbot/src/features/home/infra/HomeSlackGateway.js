// src/features/home/infra/HomeOpenSlackGateway.js

const { SlackGatewayBase } = require("../../../core/slack/SlackGatewayBase")

class HomeSlackGateway extends SlackGatewayBase{
    async updateHome({ userId, view }) {
        await this.slackApiAdaptor.viewsPublish({
            userId: userId,
            view: view,
        })
    }
}

module.exports = { HomeSlackGateway }