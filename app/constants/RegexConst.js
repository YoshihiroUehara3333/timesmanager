exports.RegexConst = {
    DATE: /\*【日記】\*([^\n]+)/,
    WORKINGTIME: /\*【時間】\*([^\n]+)/,
    WORK: /\*【業務内容】\*([\s\S]*?)\*【自己評価】\*/,
    EVALUATION: /\*【自己評価】\*([\s\S]*?)\*【翌日の計画】\*/,
    PLAN: /\*【翌日の計画】\*([\s\S]*?)\*【その他】\*/,
    OTHER: /\*【その他】\*([\s\S]*)/,
    COMMANDS: {
        AI_FEEDBACK: /\/AIフィードバック/,
    }
};