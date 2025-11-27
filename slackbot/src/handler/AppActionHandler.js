// app.action用Controllerクラス

// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { HandlerBase } = require('./HandlerBase')
const { ModalConst } = require('../constants/ModalConst')
const { ViewsOpen } = require('../slack/SlackApiRequest')

const { TaskInputModal } = require('../blockkit/TaskInputModal')
const { DailyReportInputModal } = require('../blockkit/DailyReportInputModal')
const { AttendanceInputModal } = require('../blockkit/AttendanceInputModal')

class AppActionHandler extends HandlerBase {
  constructor ({
    dailyReportService,
    taskService,
    slackApiAdaptor
  }) {
    super({ slackApiAdaptor })

    this.dailyReportService = dailyReportService
    this.taskService = taskService

    this.dispatcher = {
      [`${ModalConst.ACTION_ID.HOME.DAILYREPORT}`]: this.handleHomeToDailyReport.bind(this),
      [`${ModalConst.ACTION_ID.HOME.ATTENDANCE}`]: this.handleHomeToAttendance.bind(this),
      [`${ModalConst.ACTION_ID.TASK.CREATE}`]: this.handleWorkReportCreate.bind(this),
      [`${ModalConst.ACTION_ID.TASK.UPDATE}`]: this.handleWorkReportUpdate.bind(this),
      // [`${ModalConst.ACTION_ID.TASK.FINISH}`]        : this.handleWorkReportFinish.bind(this),
      default: this.handleDefault.bind(this)
    }
  }

  async handle (body, logger) {
    const actions = body.actions[0]
    logger.info(`action_id:${actions.action_id}`)

    const handler = this.dispatcher[actions.action_id] || this.dispatcher.default
    const userId = body.user_id

    logger.info(`${handler.name}を実行`)
    await this.execute(handler, userId, body, logger)
  }

  async handleHomeToDailyReport (body) {
    const modalparams = {
      userId: body.user.id,
    }

    return new ViewsOpen(
      body.trigger_id,
      DailyReportInputModal(modalparams)
    )
  }

  async handleHomeToAttendance (body) {
    const date = new Date().toFormat('YYYY-MM-DD')
    const userId = body.user.id

    const url = `${process.env.BACKEND_API_BASE_URL}/api/attendance`
    const getParams = `?userId=${userId}&date=${date}`

    const response = await axios.get(url + getParams)
    console.log(response)
    const attendance = response.data

    return new ViewsOpen(
      body.trigger_id,
      AttendanceInputModal({
        userId: userId,
        date: date,
        attendance: attendance,
      })
    )
  }

  async handleWorkReportCreate (body) {
    const params = {
      channel_id: '',
      user_id: '',
      thread_ts: '',
      date: '',
      serial: '',
    }

    return new ViewsOpen(
      body.trigger_id,
      TaskInputModal(params)
    )
  }

  async handleWorkReportUpdate (body) {
    const params = {
      channel_id: '',
      user_id: '',
      thread_ts: '',
      date: '',
      serial: '',
    }

    return new ViewsOpen(
      body.trigger_id,
      TaskInputModal(params)
    )
  }
}

exports.AppActionHandler = AppActionHandler
