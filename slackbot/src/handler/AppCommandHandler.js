// app.command受け取り時

// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { SlackConst } = require('../constants/SlackConst')
const { PostMessage, ViewsOpen, GetPermalink } = require('../slack/SlackApiRequest')
const { TaskInputModal } = require('../blockkit/TaskInputModal')
const { HandlerBase } = require('./HandlerBase')

class AppCommandHandler extends HandlerBase {
  constructor
  ({
    dailyReportService,
    threadService,
    taskService,
    slackApiAdaptor
  }) {
    super({ slackApiAdaptor })

    this.dailyReportService = dailyReportService
    this.threadService = threadService
    this.taskService = taskService

    this.dispatcher = {
      [`${SlackConst.APPCOMMANDS.MAKETHREAD}`]: this.handleMakethread.bind(this),
      [`${SlackConst.APPCOMMANDS.NEWTASK}`]: this.handleNewTask.bind(this),
      [`${SlackConst.APPCOMMANDS.WARMUP}`]: this.handleWarmUp.bind(this),
      default: this.handleDefault.bind(this)
    }
  }

  async handle (body, logger) {
    const userId = body.command.user
    const handler = this.dispatcher[body.command.command] || this.dispatcher.default

    logger.info(`${handler.name}を実行`)
    await this.execute(handler, userId, body, logger)
  }

  // /makethread実行時
  async handleMakethread ({ command }) {
    const channelId = command.channel_id
    const userId = command.user_id
    const date = new Date().toFormat('YYYY-MM-DD')

    // timesチャンネルにスレッド作成
    const text = `<@${userId}> \n*【壁】${date}*`
    const thread = await this.slackApiAdaptor.send(new PostMessage({
      channelId: channelId,
      text: text,
    }))
    const permalink = await this.slackApiAdaptor.send(new GetPermalink({
      channelId: channelId,
      messageTs: thread.ts
    }))

    // バックエンドAPIにPOST送信
    const data = {
      channelId: channelId,
      date: date,
      userId: userId,
      threadTs: thread.ts,
      permalink: permalink,
    }

    const url = `${process.env.BACKEND_API_BASE_URL}/api/thread`
    const response = await axios.post(url, data)

    const params = await this.taskService.createTaskInputModalParams(command, thread)
    if (params) {
      return new ViewsOpen(
        command.trigger_id,
        TaskInputModal(params)
      )
    }
  }

  // /newtask実行時
  async handleNewTask (body) {
    const command = this.getCommandFromBody(body)

    const params = await this.taskService.createTaskInputModalParams(command, undefined)
    if (params) {
      return new ViewsOpen(
        command.trigger_id,
        TaskInputModal(params)
      )
    } else {
      return new PostMessage(
        command.user,
        '今日のスレッド情報を取得できませんでした。'
      )
    }
  }

  // /warmup実行時
  async handleWarmUp (body) {
    const command = this.getCommandFromBody(body)

    return new PostMessage(
      command.user,
      'warmupが実行されました'
    )
  }

  getCommandFromBody (body) {
    return body.command
  }
}

exports.AppCommandHandler = AppCommandHandler
