// src/features/home/HomeOpenSlackGateway.js

class HomeSlackGateway {
    constructor(slackApiAdaptor) {
        this.slackApiAdaptor = slackApiAdaptor
    }

    async updateHome({ userId, view }) {
        await this.slackApiAdaptor.viewsPublish({
            userId: userId,
            view: view,
        })
    }
}

module.exports = { HomeSlackGateway }