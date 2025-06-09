//モジュール読み込み
require('date-utils');
const { WorkReportUtils } = require('../utility/WorkReportUtils');
const { NewTaskModal }    = require('../blockkit/NewTaskModal');
const { WorkPlanBlock }   = require('../blockkit/WorkPlanBlock');
const { WorkReportModel } = require('../model/WorkReportModel');
const { POSTDATA }        = require('../constants/DynamoDB/PostData');

class WorkReportService {
    constructor (postDataRepositry, slackApiAdaptor) {
        this.postDataRepositry = postDataRepositry;
        this.slackApiAdaptor   = slackApiAdaptor;
    }
    
    // 新規タスク入力用モーダルのBlockkitを作成し返却する
    async processNewTaskCommand (command) {
        const date   = new Date().toFormat("YYYY-MM-DD"); // YYYY-MM-DD
        const thread = this.postDataRepositry.queryByDateAndSortKeyPrefix(date, POSTDATA.SORT_KEY_PREFIX.THREAD);
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
        const blocks = WorkPlanBlock(userId, taskName, goal, targetTime, memo);
        console.log(`reply:${JSON.stringify$(blocks)}`);
        return blocks;
    }

    // NewTaskモーダル入力値からWorkReportModelを作成し、DBに保存する
    async saveWorkReportData (view, metadata) {
        let date = new Date().toFormat("YYYY-MM-DD");
        const values = view.state.values;

        // WorkReportModelを生成
        const workReportModel = this.createWorkReportModel(channelId, date, metadata, values);

        try {
            const response = await this.postDataRepository.putItem(workReportModel);
        } catch (error) {
            throw new Error(error.message, { cause: error });
        }
    }

    // WorkReportModelを生成してreturn
    createWorkReportModel (channelId, date, metadata, values) {
        const workReportModel = new WorkReportModel(channelId, date);
        workReportModel.threadTs    = metadata.thread_ts;
        workReportModel.content     = WorkReportUtils.parseContent(values);
        return workReportModel;
    }
}

exports.WorkReportService = WorkReportService;