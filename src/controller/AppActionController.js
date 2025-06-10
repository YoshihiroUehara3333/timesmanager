// app.action用Controllerクラス

//モジュール読み込み
const { SlackConst } = require('../constants/SlackConst');

class AppActionController {
    constructor (workReportService, slackApiAdaptor) {
        this.workReportService = workReportService;
    };

    async handleWorkReportAction (){
        return;
    };
}

exports.AppActionController = AppActionController;