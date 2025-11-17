// モジュール読み込み
require('date-utils')
const { WorkReportUtils } = require('../utility/WorkReportUtils')
const { axios } = require('axios')
const { WorkPlanBlock } = require('../blockkit/WorkPlanBlock')
const { TaskModel } = require('../model/TaskModel')
const { POSTDATA } = require('../constants/DynamoDB/PostData')
const { PostMessage } = require('../slack/SlackApiRequest')

class TaskService {
  constructor ({
    slackApiAdaptor
  }) {
    this.slackApiAdaptor = slackApiAdaptor
  }

  async getByUserId ({ userId }) {
    const tasks = await axios.get('https://dev.slack-times-manager.com/api/task' + `?userId=${userId}`)
      .then((status) => {
        console.log('getByUserId:', status)
      })
      .catch(err => {
        console.error('getByUserId:', err)
      })
    return tasks
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
