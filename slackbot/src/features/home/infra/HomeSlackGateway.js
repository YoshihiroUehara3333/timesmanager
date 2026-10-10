// src/features/home/infra/HomeSlackGateway.js

const { SlackGatewayBase } = require('../../../core/slack/SlackGatewayBase')

class HomeSlackGateway extends SlackGatewayBase {
  async updateHome ({ userId, view }) {
    return await this.slackApiAdaptor.viewsPublish({
      userId: userId,
      view: view,
    })
  }
}

module.exports = { HomeSlackGateway }
