class DiaryUtils {
    // JSONデータから日記フォーマットに変換してreturnする
    static formatDiaryFromJson(diaryJson) {
        const content = diaryJson.content || {};
        const date = diaryJson.date || '';
    
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

        const workingTimeMatch = text.match(/\*【時間】\*([^\n]+)/);
        const workMatch = text.match(/\*【業務内容】\*([\s\S]*?)\*【自己評価】\*/);
        const evaluationMatch = text.match(/\*【自己評価】\*([\s\S]*?)\*【翌日の計画】\*/);
        const planMatch = text.match(/\*【翌日の計画】\*([\s\S]*?)\*【その他】\*/);
        const otherMatch = text.match(/\*【その他】\*([\s\S]*)/);

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
        const dateMatch = text.match(/\*【日記】\*([^\n]+)/);
        if (dateMatch) {
            return dateMatch[1].trim();
        } else {
            return '';
        }
    };
}

exports.DiaryUtils = DiaryUtils;