//モジュール読み込み
const { WorkReportModel } = require('../model/WorkReportModel');

class WorkReportService {
    postDataRepositry;

    constructor (postDataRepositry) {
        this.postDataRepositry = postDataRepositry;
    };
    
    async processNewWorkReport (body, view, logger, client) {
        const workReportModel = this.createWorkReportModel(body, view);
        
        // DB保存
        await this.postDataRepositry.putItem(workReportModel.toItem());
    };

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