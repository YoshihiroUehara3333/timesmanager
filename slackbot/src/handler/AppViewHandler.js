// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { ModalConst } = require('../constants/ModalConst')
const { PostMessage } = require('../slack/SlackApiRequest')
const { HandlerBase } = require('./HandlerBase')
const { TaskBlock } = require('../blockkit/TaskBlock')

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
      [`${this.CALLBACK_ID.TASK_INPUT}`]: this.handleNewTaskModalCallback.bind(this),
      [`${this.CALLBACK_ID.ATTENDANCE_INPUT}`]: this.handleDailyAttendanceInputCallback.bind(this),
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

  // 勤怠情報入力送信
  async handleDailyAttendanceInputCallback ({ view }) {
    const metadata = JSON.parse(view.private_metadata)
    const values = view.state.values

    const postParams = {
      date: metadata.date,
      userId: metadata.user_id,
      startTime: values.starttime.start_time.selected_time,
      endTime: values.endtime.end_time.selected_time,
      workplace: values.workplace.select_workplace.selected_option.value,
    }

    // バックエンドAPIにPOST送信
    const url = `${process.env.BACKEND_API_BASE_URL}/api/attendance`
    const response = await axios.post(url, postParams)

    if (response.status === 200) {
      console.log('handleDailyAttendanceInputCallback完了')
    }
  }

  // タスク新規作成送信
  async handleNewTaskModalCallback ({ view }) {
    const metadata = JSON.parse(view.private_metadata)
    const values = view.state.values

    // 入力データをBlocksとして返信
    const params = {
      userId: metadata.user_id,
      taskName: values.taskName.input.value,
      targetTime: values.targetTime.input.value,
      memo: values.memo.input.value,
      serial: metadata.memo,
    }

    const postResponse = await this.slackApiAdaptor.send(new PostMessage(
      metadata.channel_id,
      '新規タスクが入力されました',
      metadata.thread_ts,
      TaskBlock(params)
    ))
    console.log(`post結果:${JSON.stringify(postResponse)}`)

    // バックエンドAPIにPOST送信
    const url = `${process.env.BACKEND_API_BASE_URL}/api/task`
    const postParams = {
      channelId: metadata.channel_id,
      threadTs: metadata.thread_ts,
      serial: metadata.serial,
      status: metadata.status,
    }
    const response = await axios.post(url, postParams)
    if (response.status === 200) {
      return new PostMessage(
        metadata.user_id,
        'タスク情報ののDB登録に成功しました'
      )
    }
    return await this.TaskService.processNewTaskSubmition(view)
  }
}

exports.AppViewHandler = AppViewHandler
