// モジュール読み込み
require('date-utils')
const axios = require('axios')
const { WorkReportUtils } = require('../utility/WorkReportUtils')
const { PostMessage } = require('../slack/SlackApiRequest')

class TaskService {
  constructor ({
    slackApiAdaptor
  }) {
    this.slackApiAdaptor = slackApiAdaptor
  }

  /**
   * 引数で渡されたユーザIDを基にタスクを全件取得する
   * @param {*} param0
   * @returns tasks: 取得結果
   */
  async getByUserId ({ userId }) {
    const tasks = await axios.get(`${process.env.BACKEND_API_BASE_URL}/api/task?userId=${userId}`)
      .then((status) => {
        console.log('getByUserId:', status)
      })
      .catch((err) => {
        console.error('getByUserId:', err)
      })
    return tasks
  }

  /**
   * 最新のタスク識別番号を発行する
   * @param {userId}ユーザID
   * @param {date}日付
   * @returns latestSerial: 最新の識別番号
   */
  async issueLatestSerial ({ userId, date }) {
    const url = `${process.env.BACKEND_API_BASE_URL}/api/task/serial`
    const getParams = `?userId=${userId}&date=${date}`
    const latestSerial = await axios.get(url + getParams)
    return latestSerial
  }

  // 新規タスク入力用モーダルのBlockkit作成用パラメータを取得し返却する
  async createTaskInputModalParams (command, thread) {
    console.log('openCreateTaskModalを実行')

    const date = new Date().toFormat('YYYY-MM-DD')
    const channelId = command.channel_id
    try {
      if (!thread) {
        // GET to /api/threadに書き換え
        thread = await this.postDataRepository.getThreadByDate(channelId, date)
        if (!thread) return undefined
      }

      const stringWorkReportCount = await this.postDataRepository.getWorkReportCount(channelId, date)
      const latestSerial = parseInt(stringWorkReportCount) + 1

      return {
        channelId: channelId,
        threadTs: thread.thread_ts,
        date: date,
        serial: latestSerial,
        userId: command.user_id
      }
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  // タスク更新用モーダルのBlockkitを作成し返却する
  async updateTask () {
    // DBからタスク情報を取得
  }

  // /makethread入力時のNewTaskモーダル入力値を取得し、Blocksを返す
  async setWorkPlanBlockParams (view) {
    const workPlanBlockParams = {}

    const metadata = JSON.parse(view.private_metadata)
    workPlanBlockParams.serial = metadata.serial
    workPlanBlockParams.userId = metadata.userId

    const values = view.state.values
    workPlanBlockParams.taskName = values.taskname.input.value || ''
    workPlanBlockParams.goal = values.goal.input.value || ''
    workPlanBlockParams.targetTime = values.targettime.input.selected_time
    workPlanBlockParams.memo = values.memo.input.value || ''

    // Blocksを生成してreturn
    return workPlanBlockParams
  }

  // NewTaskモーダル入力値からWorkReportModelを作成し、DBに保存する
  async processNewTaskSubmition (view) {
    const date = new Date().toFormat('YYYY-MM-DD')
    const values = view.state.values
    const metadata = JSON.parse(view.private_metadata)
    const channelId = metadata.channel_id

    try {
      // WorkReportModelを生成
      const workReportModel = this.createWorkReportModel(channelId, date, metadata, values)

      // DB保存
      const response = await this.postDataRepository.putItem(workReportModel)

      // httpStatusCodeをチェックしてreturn
      const httpStatusCode = response.$metadata?.httpStatusCode
      return new PostMessage(
        metadata.user_id,
        this.checkHttpStatusCode(httpStatusCode, workReportModel)
      )
    } catch (error) {
      throw new Error(error.message, { cause: error })
    }
  }

  // WorkReportModelを生成してreturn
  createWorkReportModel (channelId, date, metadata, values) {
    const workReportModel = new WorkReportModel(channelId, date)
    workReportModel.threadTs = metadata.thread_ts
    workReportModel.createdAt = new Date().toFormat('HH24:MI:SS')
    workReportModel.content = WorkReportUtils.parseContent(values)
    workReportModel.serial = metadata.serial
    return workReportModel
  }

  // -----------------------------------------------------------------------------------
  // DynamoDBへのPut成否をhttpStatusCodeから判断してreturnを作成する
  checkHttpStatusCode (httpStatusCode, workReportModel) {
    if (httpStatusCode === 200) {
      return `進捗情報ののDB登録に成功しました serial=${workReportModel.serial}`
    } else {
      return '進捗情報ののDB登録に失敗しました/n' +
        `httpStatusCode=${httpStatusCode}`
    }
  }
}

exports.TaskService = TaskService
