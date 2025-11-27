// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { ModalConst } = require('../constants/ModalConst')
const { PostMessage } = require('../slack/SlackApiRequest')
const { HandlerBase } = require('./HandlerBase')
const { WorkPlanBlock } = require('../blockkit/WorkPlanBlock')

class AppViewHandler extends HandlerBase {
  CALLBACK_ID = ModalConst.CALLBACK_ID

  constructor ({
    threadService,
    taskService,
    slackApiAdaptor
  }) {
    super({ slackApiAdaptor: slackApiAdaptor })

    this.threadService = threadService
    this.taskService = taskService

    this.dispatcher = {
      [`${this.CALLBACK_ID.NEWTASK}`]: this.handleNewTaskModalCallback.bind(this),
      [`${this.CALLBACK_ID.ATTENDANCE_SUBMIT}`]: this.handleDailyAttendanceInputCallback.bind(this),
      default: this.handleDefault.bind(this)
    }
  }

  async handle (body, logger) {
    const view = body.view
    const callbackId = view.callback_id
    logger.info(`callbackId:${callbackId}`)

    const handler = this.dispatcher[callbackId] || this.dispatcher.default
    const userId = JSON.parse(view.private_metadata).user_id

    logger.info(`${handler.name}を実行`)
    await this.execute(handler, userId, body, logger)
  }

  async handleDailyAttendanceInputCallback ({ view }) {
    const metadata = JSON.parse(view.private_metadata)
    const values = view.state.values

    const data = {
      date: metadata.date,
      userId: metadata.user_id,
      startTime: values.starttime.start_time.selected_time,
      endTime: values.endtime.end_time.selected_time,
      workplace: values.workplace.select_workplace.selected_option.value,
    }

    console.log(JSON.stringify(data))

    // バックエンドAPIにPOST送信
    const url = `${process.env.BACKEND_API_BASE_URL}/api/attendance`
    try {
      const response = await axios.post(url, data)
      console.log(response)
    } catch (e) {
      console.error(e)
    }
  }

  async handleNewTaskModalCallback ({ view }) {
    const metadata = JSON.parse(view.private_metadata)

    // 入力データをBlocksとして返信
    const params = await this.workReportService.setWorkPlanBlockParams(view)
    const postResponse = await this.slackApiAdaptor.send(new PostMessage(
      metadata.channel_id,
      'blocks送信',
      metadata.thread_ts,
      WorkPlanBlock(params)
    ))
    console.log(`post結果:${JSON.stringify(postResponse)}`)

    // 入力データをDBに保存
    return await this.workReportService.processNewTaskSubmition(view)
  }
}

exports.AppViewHandler = AppViewHandler
