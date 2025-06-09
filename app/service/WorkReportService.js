//モジュール読み込み
require('date-utils');
const { NewTaskModal }    = require('../blockkit/NewTaskModal');
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

    // /makethread入力時のNewTaskモーダル入力値を処理する
    async processNewTaskSubmissionViewData(view, userId) {
        // メタデータ取得
        let date = new Date().toFormat("YYYY-MM-DD");
        let metadata = JSON.parse(view.private_metadata);

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

    createWorkReportModel (channelId, date, metadata) {
        const workReportModel = new WorkReportModel(channelId, date);
        workReportModel.threadTs     = metadata.thread_ts;

        workReportModel.workPlan     = view.state.values.work_plan.work_plan.value || '';
        workReportModel.selectedTime = view.state.values.timepicker.timepicker.selected_time;
        workReportModel.option       = view.state.values.option.option.value || '';
        return workReportModel;
    }
}

exports.WorkReportService = WorkReportService;