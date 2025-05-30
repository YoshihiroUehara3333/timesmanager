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
        return workReportModel;
    }
}

exports.WorkReportService = WorkReportService;