//モジュール読み込み
require('date-utils');
const { WorkReportUtils } = require('../utility/WorkReportUtils');
const { NewTaskModal }    = require('../blockkit/NewTaskModal');
const { WorkPlanBlock }   = require('../blockkit/WorkPlanBlock');
const { WorkReportModel } = require('../model/WorkReportModel');
const { POSTDATA }        = require('../constants/DynamoDB/PostData');
const { PostMessage }     = require('../adaptor/slack/SlackApiRequest');

class WorkReportService {
    constructor (postDataRepository, slackApiAdaptor) {
        this.postDataRepository = postDataRepository;
        this.slackApiAdaptor   = slackApiAdaptor;
    }
    
    // 新規タスク入力用モーダルのBlockkitを作成し返却する
    async processNewTaskCommand (command) {
        const date   = new Date().toFormat("YYYY-MM-DD"); // YYYY-MM-DD
        const thread = this.postDataRepository.queryByDateAndPartitionKeyPostfix(date, POSTDATA.PK_POSTFIX.THREAD);
        console.log(JSON.stringify(thread));

        // DB保存
        return NewTaskModal(channel_id, postResult.ts, date, 1);
    }

    // /makethread入力時のNewTaskモーダル入力値を取得し、Blocksを返す
    async processNewTaskSubmissionViewData(view, userId) {
        // モーダル入力値を取得
        const values        = view.state.values;
        const taskName      = values.taskname.input.value || '';
        const goal          = values.goal.input.value || '';
        const targetTime    = values.targettime.input.selected_time;
        const memo          = values.memo.input.value || '';

        // Blocksを生成してreturn
        return WorkPlanBlock(userId, taskName, goal, targetTime, memo);
    }

    // NewTaskモーダル入力値からWorkReportModelを作成し、DBに保存する
    async saveWorkReportData (view, metadata) {
        let date = new Date().toFormat("YYYY-MM-DD");
        const values = view.state.values;
        const channelId = metadata.channel_id;

        try {
            // WorkReportModelを生成
            const workReportModel  = this.createWorkReportModel(channelId, date, metadata, values);

            // 最新シリアルを取得
            let partitionKey = workReportModel.partitionKey;
            let latestSerial = await this.postDataRepository.queryWorkReportLatestSerial(partitionKey, date);
            workReportModel.serial = latestSerial;

            // DB保存
            const response = await this.postDataRepository.putItem(workReportModel);
            
            // httpStatusCodeをチェックしてreturn
            const httpStatusCode = response.$metadata?.httpStatusCode;
            return new PostMessage(
                metadata.user_id,
                this.checkHttpStatusCode(httpStatusCode, workReportModel)
            );

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