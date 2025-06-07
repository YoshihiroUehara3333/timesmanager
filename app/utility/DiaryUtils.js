const { RegexConst } = require('../constants/RegexConst');
const { CdConst }    = require('../constants/CdConst');

class DiaryUtils {
    // JSONデータから日記フォーマットに変換してreturnする
    static formatDiaryFromJSON(diaryJson) {
        const content  = diaryJson.content || {};
        const date     = diaryJson.date || '';
    
        return (
            `*【日記】* ${date}\n` +
            `*【時間】* ${content.workingTime.start || ''}-${content.workingTime.end || ''}\n` +
            `*【業務内容】*\n${content.work_report || ''}\n` +
            `*【自己評価】*\n${content.evaluation || ''}\n` +
            `*【翌日の計画】*\n${content.plan || ''}\n` +
            `*【その他】*\n${content.other || ''}`
        );
    }

    // Slack側から送信されたtextからcontentデータを抽出してreturnする
    static parseContent (text) {
        const content = {
            working_time : {
                start : 'hh:mm',
                end   : 'hh:mm',
            },
            work_report  : '',
            evaluation   : '',
            plan         : '',
            other        : ''
        };

        const workingTimeMatch  = text.match(RegexConst.WORKINGTIME);
        const workReportMatch   = text.match(RegexConst.WORKREPORT);
        const evaluationMatch   = text.match(RegexConst.EVALUATION);
        const planMatch         = text.match(RegexConst.PLAN);
        const otherMatch        = text.match(RegexConst.OTHER);

        if (workingTimeMatch) {
            const timeText = workingTimeMatch[1].trim(); // "09:00-18:00"
            const [start, end] = timeText.split('-').map(t => t.trim());
            content.working_time = {
                start : start || '',
                end   : end || ''
            };
        }

        if (workReportMatch) content.work_report = workReportMatch[1].trim();
        if (evaluationMatch) content.evaluation = evaluationMatch[1].trim();
        if (planMatch) content.plan = planMatch[1].trim();
        if (otherMatch) content.other = otherMatch[1].trim();

        return content;
    };

    // Slack側から送信されたtextから日付を抽出してreturnする
    // 未入力の場合は空文字をreturn
    static parseDate (text) {
        const dateMatch = text.match(RegexConst.DATE);
        if (dateMatch) {
            return dateMatch[1].trim();
        } else {
            return '';
        }
    };

    // textからWorkingPlaceCdを取得する
    static parseWorkingPlaceCd (text) {
        const WorkingPlace = CdConst.WORKINGPLACE;

        const workingPlaceMatch  = text.match(RegexConst.WORKINGPLACE);
        const name = workingPlaceMatch[1].trim();
        
        return WorkingPlace.getCodeByName(name);
    }
}

exports.DiaryUtils = DiaryUtils;