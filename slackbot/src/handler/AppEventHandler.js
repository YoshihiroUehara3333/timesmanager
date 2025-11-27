// app.event受け取り時

const { AppHomeView } = require('../blockkit/AppHomeView')
const { ViewsPublish } = require('../slack/SlackApiRequest')
const { HandlerBase } = require('./HandlerBase')

class AppEventHandler extends HandlerBase {
  constructor ({
    slackApiAdaptor,
    taskService,
  }) {
    super({ slackApiAdaptor })
    this.taskService = taskService

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

  /**
   * ホーム画面を開いたときの処理
   */
  async updateAppHome ({ event }) {
    const userId = event.user

    const tasks = this.taskService.getByUserId({ userId: userId })
    console.log(tasks)

    return new ViewsPublish({
      userId: userId,
      view: AppHomeView(tasks)
    })
  }
}

exports.AppEventHandler = AppEventHandler
