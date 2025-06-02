//モジュール読み込み
const { WorkReportModel } = require('../model/WorkReportModel');

class WorkReportService {
    constructor (workReportRepository) {
        this.workReportRepository = workReportRepository;
    };
    
    async processNewWorkReport (body, view, logger, client) {
        const workReportModel = this.createWorkReportModel(body, view);
        
        // DB保存
        await this.workReportRepository.putWorkReport(workReportModel);
    };

    createWorkReportModel (body, view) {
        const workReportModel = new WorkReportModel;
        const { channel_id, thread_ts } = JSON.parse(view.private_metadata);

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