// app.event受け取り時
require('date-utils')
const { AppHomeView } = require('../blockkit/AppHomeView')
const { TaskConst } = require('../constants/TaskConst')
const { ViewsPublish } = require('../slack/SlackApiRequest')
const { HandlerBase } = require('./HandlerBase')

class AppEventHandler extends HandlerBase {
  constructor ({
    slackApiAdaptor,
    taskService,
    threadService,
  }) {
    super({ slackApiAdaptor })
    this.taskService = taskService
    this.threadService = threadService

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
    const date = new Date().toFormat('YYYY-MM-DD')
    const userId = event.user
    const thread = await this.threadService.checkIsAlreadyExecuted({ userId: userId, date: date })

    let tasks = []
    if (thread.exists) {
      // タスクリストを取得
      tasks = await this.taskService.getByUserId({ userId: userId })
      if (tasks.length) {
        // activeなもので絞り込む
        tasks = tasks.filter((task) => task.status === TaskConst.STATUS.ACTIVE)
      }
    }

    return new ViewsPublish({
      userId: userId,
      view: AppHomeView({ tasks: tasks, threadExists: thread.exists })
    })
  }
}

exports.AppEventHandler = AppEventHandler
