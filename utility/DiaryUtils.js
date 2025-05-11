class DiaryUtils {
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
}

exports.DiaryUtils = DiaryUtils;