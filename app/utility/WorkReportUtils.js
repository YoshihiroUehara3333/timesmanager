const { RegexConst } = require('../constants/RegexConst');
const { CdConst }    = require('../constants/CdConst');

class WorkReportUtils {
    static parseContent (values) {
        const content = {};

        content.taskName = values.taskname.input.value || '';
        content.goal     = values.goal.input.value || '';
        content.progress = {
            targetTime : values.targettime.input.selected_time,
            memo       : values.memo.input.value || '',
        }
        return content;
    }
}

exports.WorkReportUtils = WorkReportUtils;