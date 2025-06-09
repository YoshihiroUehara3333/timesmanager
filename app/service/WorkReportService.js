//モジュール読み込み
require('date-utils');
const { NewTaskModal }    = require('../blockkit/NewTaskModal');
const { WorkReportModel } = require('../model/WorkReportModel');
const { POSTDATA }   = require('../constants/DynamoDB/DynamoDBConst');

class WorkReportService {
    postDataRepositry;

    constructor (postDataRepositry) {
        this.postDataRepositry = postDataRepositry;
    };
    
    // 新規タスク入力用モーダルのBlockkitを作成し返却する
    async processNewTask (command) {
        const date   = new Date().toFormat("YYYY-MM-DD"); // YYYY-MM-DD
        const thread = this.postDataRepositry.queryByDateAndSortKeyPrefix(date, POSTDATA.SORT_KEY_PREFIX.THREAD);
        console.log(JSON.stringify(thread));

        // DB保存
        return NewTaskModal(channel_id, postResult.ts, date, 1);
    };

    // /makethread入力時のNewTaskモーダル受け取り
    async processNewTaskSubmission (body, view) {
        // メタデータ取得
        const user_id  = body.user.id;
        const metadata = JSON.parse(view.private_metadata);

        // モーダル入力値を取得
        const values = view.state.values;
        const work_plan     = view.state.values.work_plan.work_plan.value || '';
        const selected_time = view.state.values.timepicker.timepicker.selected_time;
        const option        = view.state.values.option.option.value || '';

        // スレッドへ返信
        const msg = "作業計画";
        const blocks = WorkPlanBlock(user_id, work_plan, selected_time, option);

        console.log(`reply:${JSON.stringify(reply)}`);

        // 必要であればDBに保存（例: DynamoDB）
        await this.workReportService.processNewWorkReport(body, view);
    }

    createWorkReportModel (body, view) {
        const { channel_id, thread_ts } = JSON.parse(view.private_metadata);

        const workReportModel = new WorkReportModel(channel_id, thread_ts);
        workReportModel.userId       = body.user.id;
        workReportModel.threadTs     = thread_ts;
        workReportModel._channel     = channel_id;

        workReportModel.workPlan     = view.state.values.work_plan.work_plan.value || '';
        workReportModel.selectedTime = view.state.values.timepicker.timepicker.selected_time;
        workReportModel.option       = view.state.values.option.option.value || '';
        return workReportModel;
    }
}

exports.WorkReportService = WorkReportService;