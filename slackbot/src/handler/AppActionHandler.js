// app.action用Controllerクラス

// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { HandlerBase } = require('./HandlerBase')
const { ModalConst } = require('../constants/ModalConst')
const { TaskConst } = require('../constants/TaskConst')
const { ViewsOpen } = require('../slack/SlackApiRequest')

const { TaskInputModal } = require('../blockkit/TaskInputModal')
const { DailyReportInputModal } = require('../blockkit/DailyReportInputModal')
const { AttendanceInputModal } = require('../blockkit/AttendanceInputModal')
const { BackendRouting } = require('../constants/BackendRouting')

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
      [`${ModalConst.ACTION_ID.TASK.CREATE}`]: this.handleTaskCreate.bind(this),
      [`${ModalConst.ACTION_ID.TASK.UPDATE}`]: this.handleTaskUpdate.bind(this),
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

  /**
   * ホーム画面から勤怠入力モーダルを開く
   * @param {*} body
   * @returns SlackRequest
   */
  async handleHomeToAttendance (body) {
    const date = new Date().toFormat('YYYY-MM-DD')
    const userId = body.user.id

    const url = `${process.env.BACKEND_API_BASE_URL}${BackendRouting.ATTENDANCE.ROOT}`
    const response = await axios.get(url, {
      params: {
        userId: userId,
        date: date,
      },
    })

    return new ViewsOpen({
      triggerId: body.trigger_id,
      view: AttendanceInputModal({
        userId: userId,
        date: date,
        attendance: response.data[0],
      })
    })
  }

  /**
   * ホーム画面からタスク新規作成モーダルを開く
   * @param {*} body
   * @returns SlackRequest
   */
  async handleTaskCreate (body) {
    const userId = body.user.id
    const date = new Date().toFormat('YYYY-MM-DD')

    const params = {
      userId: userId,
      threadTs: '',
      date: date,
      serial: await this.taskService.issueLatestSerial({ userId: userId, date: date }),
      status: TaskConst.STATUS.ACTIVE,
    }

    return new ViewsOpen({
      triggerId: body.trigger_id,
      view: TaskInputModal(params)
    })
  }

  async handleTaskUpdate (body) {
    const params = {
      channel_id: '',
      user_id: '',
      thread_ts: '',
      date: '',
      serial: '',
    }

    return new ViewsOpen({
      triggerId: body.trigger_id,
      view: TaskInputModal(params)
    })
  }
}

exports.AppActionHandler = AppActionHandler
