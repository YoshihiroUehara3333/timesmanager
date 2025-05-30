const { RegexConst } = require('../constants/RegexConst');


class DiaryUtils {
    // JSONデータから日記フォーマットに変換してreturnする
    static formatDiaryFromJson(diaryJson) {
        const content  = diaryJson.content || {};
        const date     = diaryJson.date || '';
    
        return (
            `*【日記】* ${date}\n` +
            `*【時間】* ${content.workingTime || ''}\n` +
            `*【業務内容】*\n${content.work || ''}\n` +
            `*【自己評価】*\n${content.evaluation || ''}\n` +
            `*【翌日の計画】*\n${content.plan || ''}\n` +
            `*【その他】*\n${content.other || ''}`
        );
    }

    // Slack側から送信されたtextからcontentデータを抽出してreturnする
    static parseContent (text) {
        const content = {
            workingTime: '',
            work: '',
            evaluation: '',
            plan: '',
            other: ''
        };

        const workingTimeMatch  = text.match(RegexConst.WORKINGTIME);
        const workMatch         = text.match(RegexConst.WORK);
        const evaluationMatch   = text.match(RegexConst.EVALUATION);
        const planMatch         = text.match(RegexConst.PLAN);
        const otherMatch        = text.match(RegexConst.OTHER);

        if (workingTimeMatch) content.workingTime = workingTimeMatch[1].trim();
        if (workMatch) content.work = workMatch[1].trim();
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
}

exports.DiaryUtils = DiaryUtils;