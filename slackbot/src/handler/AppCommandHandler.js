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

  async handle (command, logger) {
    const userId = command.user_id
    const handler = this.dispatcher[command.command] || this.dispatcher.default

    logger.info(`${handler.name}を実行`)
    await this.execute(handler, userId, command, logger)
  }

  /**
   * スラッシュコマンド/makethread実行時
   * @param {*} command
   * @returns SlackApiRequest
   */
  async handleMakethread (command) {
    const channelId = command.channel_id
    const userId = command.user_id
    const date = new Date().toFormat('YYYY-MM-DD')

    const url = `${process.env.BACKEND_API_BASE_URL}/api/thread`
    const getParams = `?userId=${userId}&date=${date}`
    const response = await axios.get(url + getParams)

    console.log(response)

    // timesチャンネルにスレッド作成
    const text = `<@${userId}> \n*【壁】${date}*`
    const threadPost = await this.slackApiAdaptor.send(new PostMessage({
      channelId: channelId,
      text: text,
    }))
    // permalink取得
    const permalink = await this.slackApiAdaptor.send(new GetPermalink({
      channelId: channelId,
      messageTs: threadPost.ts
    }))

    // バックエンドAPIにPOST送信
    const data = {
      channelId: channelId,
      date: date,
      userId: userId,
      threadTs: threadPost.ts,
      permalink: permalink,
    }
    await axios.post(url, data)
  }

  /**
   * スラッシュコマンド/newtask実行時
   * @param {*} command
   * @returns SlackApiRequest
   */
  async handleNewTask (command) {
    const params = await this.taskService.createTaskInputModalParams(command, undefined)
    if (params) {
      return new ViewsOpen({
        triggerId: command.trigger_id,
        view: TaskInputModal(params)
      })
    } else {
      return new PostMessage({
        channelId: command.user,
        text: '今日のスレッド情報を取得できませんでした。'
      })
    }
  }

  /**
   * スラッシュコマンド/warmup実行時
   * @param {*} command
   * @returns SlackApiRequest
   */
  async handleWarmUp (command) {
    return new PostMessage({
      channelId: command.user_id,
      text: 'warmupが実行されました'
    })
  }
}

exports.AppCommandHandler = AppCommandHandler
