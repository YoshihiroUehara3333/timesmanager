// app.event受け取り時

const { AppHomeView } = require('../blockkit/AppHomeView')
const { ViewsPublish } = require('../slack/SlackApiRequest')
const { HandlerBase } = require('./HandlerBase')

class AppEventHandler extends HandlerBase {
  constructor ({
    slackApiAdaptor
  }) {
    super({ slackApiAdaptor })

    this.dispatcher = {
      app_home_opened: this.updateAppHome.bind(this),
      default: this.handleDefault.bind(this)
    }
  }

  async handle (body, event, logger) {
    const userId = event.user
    const handler = this.dispatcher[event.type] || this.dispatcher.default

    logger.info(`${handler.name}を実行`)
    await this.execute(handler, userId, body, logger)
  }

  async updateAppHome (body) {
    const event = this.getEventFromBody(body)

    // タスクリストを取得する
    const tasks = []

    return new ViewsPublish(
      event.user,
      AppHomeView(tasks)
    )
  }

  getEventFromBody (body) {
    return body.event
  }
}

exports.AppEventHandler = AppEventHandler
