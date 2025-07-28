//モジュール読み込み
require('date-utils');
const { WorkReportUtils } = require('../utility/WorkReportUtils');
const { CreateTaskModal } = require('../blockkit/CreateTaskModal');
const { WorkPlanBlock }   = require('../blockkit/WorkPlanBlock');
const { WorkReportModel } = require('../model/WorkReportModel');
const { POSTDATA }        = require('../constants/DynamoDB/PostData');
const { PostMessage, ViewsOpen }     = require('../slack/SlackApiRequest');

class WorkReportService {
    constructor ({postDataRepository, slackApiAdaptor}) {
        this.postDataRepository = postDataRepository;
        this.slackApiAdaptor   = slackApiAdaptor;
    }
    
    // 新規タスク入力用モーダルのBlockkitを作成し返却する
    async createTask (command, thread) {
        console.log(`createTaskを実行`);
        const date   = new Date().toFormat("YYYY-MM-DD");
        const channelId = command.channel_id;

        // DBから情報を取得
        try {
            if(!thread){
                thread = await this.postDataRepository.getThreadByDate(channelId, date);
                if(!thread){
                    return {
                        status: false,
                        slackRequest: new PostMessage(
                            command.user_id,
                            '今日のスレッド情報を取得できませんでした。'
                    )}
                }
            }

            let stringWorkReportCount = await this.postDataRepository.getWorkReportCount(channelId, date);
            const latestSerial = parseInt(stringWorkReportCount) + 1;
            return {
                status: true,
                slackRequest: new ViewsOpen(
                    command.trigger_id,
                    CreateTaskModal(channelId, thread.thread_ts, date, latestSerial, command.user_id)
            )};
        } catch(error) {
            throw new Error(error.message, { cause: error });
        }
    }

    // タスク更新用モーダルのBlockkitを作成し返却する
    async updateTask () {
        // DBからタスク情報を取得
        
        return {
            status: true,
            slackRequest: new ViewsOpen(
                command.trigger_id,
                CreateTaskModal(channelId, thread.thread_ts, date, latestSerial, command.user_id)
        )};
    }

    // /makethread入力時のNewTaskモーダル入力値を取得し、Blocksを返す
    async setWorkPlanBlockParams(view, metadata) {
        const workPlanBlockParams = {};

        workPlanBlockParams.userId = metadata.userId;
        
        const values        = view.state.values;
        workPlanBlockParams.taskName      = values.taskname.input.value || '';
        workPlanBlockParams.goal          = values.goal.input.value || '';
        workPlanBlockParams.targetTime    = values.targettime.input.selected_time;
        workPlanBlockParams.memo          = values.memo.input.value || '';

        let stringWorkReportCount = await this.postDataRepository.getWorkReportCount(metadata.channelId, date);
        workPlanBlockParams.serial = parseInt(stringWorkReportCount) + 1;

        // Blocksを生成してreturn
        return workPlanBlockParams;
    }

    // NewTaskモーダル入力値からWorkReportModelを作成し、DBに保存する
    async processNewTaskSubmition (view, metadata) {
        let date = new Date().toFormat("YYYY-MM-DD");
        const values = view.state.values;
        const channelId = metadata.channel_id;

        try {
            // WorkReportModelを生成
            const workReportModel = this.createWorkReportModel(channelId, date, metadata, values);

            // 最新シリアルを取得
            let stringWorkReportCount = await this.postDataRepository.getWorkReportCount(channelId, date);
            workReportModel.serial = parseInt(stringWorkReportCount) + 1;

            // DB保存
            const response = await this.postDataRepository.putItem(workReportModel);
            
            // httpStatusCodeをチェックしてreturn
            const httpStatusCode = response.$metadata?.httpStatusCode;
            return {
                status: true,
                slackRequest: new PostMessage(
                    metadata.user_id,
                    this.checkHttpStatusCode(httpStatusCode, workReportModel)
                )
            };

        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    }

    // WorkReportModelを生成してreturn
    createWorkReportModel (channelId, date, metadata, values) {
        const workReportModel = new WorkReportModel(channelId, date);
        workReportModel.threadTs    = metadata.thread_ts;
        workReportModel.createdAt   = new Date().toFormat('HH24:MI:SS');
        workReportModel.content     = WorkReportUtils.parseContent(values);
        return workReportModel;
    }

    // -----------------------------------------------------------------------------------
    // DynamoDBへのPut成否をhttpStatusCodeから判断してreturnを作成する
    checkHttpStatusCode (httpStatusCode, workReportModel) {
        if (httpStatusCode === 200) {
            return `進捗情報ののDB登録に成功しました serial=${workReportModel.serial}`;
        } else {
            return `進捗情報ののDB登録に失敗しました/n`
                  +`httpStatusCode=${httpStatusCode}`;
        }
    }
}

exports.WorkReportService = WorkReportService;