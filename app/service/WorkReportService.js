//モジュール読み込み
require('date-utils');
const { NewTaskModal }    = require('../blockkit/NewTaskModal');
const { WorkReportModel } = require('../model/WorkReportModel');
const { POSTDATA }        = require('../constants/DynamoDB/PostData');

class WorkReportService {
    constructor (postDataRepositry) {
        this.postDataRepositry = postDataRepositry;
    }
    
    // 新規タスク入力用モーダルのBlockkitを作成し返却する
    async processNewTaskCommand (command) {
        const date   = new Date().toFormat("YYYY-MM-DD"); // YYYY-MM-DD
        const thread = this.postDataRepositry.queryByDateAndSortKeyPrefix(date, POSTDATA.SORT_KEY_PREFIX.THREAD);
        console.log(JSON.stringify(thread));

        // DB保存
        return NewTaskModal(channel_id, postResult.ts, date, 1);
    }

    // /makethread入力時のNewTaskモーダル受け取り
    async processNewTaskSubmission (body, view) {
        // メタデータ取得
        let userId  = body.user.id;
        let date = new Date().toFormat("YYYY-MM-DD");
        let metadata = JSON.parse(view.private_metadata);

        // モーダル入力値を取得
        const values        = view.state.values;
        const taskName      = values.taskname.input.value || '';
        const goal          = values.goal.input.value || '';
        const selectedTime  = values.targettime.input.selected_time;
        const memo          = values.memo.input.value || '';

        // WorkReportModel生成
        // DB保存

        // スレッドへ返信
        const msg = "作業計画";
        return WorkPlanBlock(userId, taskName, goal, selectedTime, memo);

        console.log(`reply:${JSON.stringify(reply)}`);

        // 必要であればDBに保存（例: DynamoDB）
        await this.workReportService.processNewWorkReport(body, view);
    }

    createWorkReportModel (channelId, date, metadata) {
        const workReportModel = new WorkReportModel(channelId, date);
        workReportModel.userId       = body.user.id;
        workReportModel.threadTs     = metadata.thread_ts;

        workReportModel.workPlan     = view.state.values.work_plan.work_plan.value || '';
        workReportModel.selectedTime = view.state.values.timepicker.timepicker.selected_time;
        workReportModel.option       = view.state.values.option.option.value || '';
        return workReportModel;
    }
}

exports.WorkReportService = WorkReportService;