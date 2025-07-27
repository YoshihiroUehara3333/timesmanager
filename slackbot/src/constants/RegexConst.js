exports.RegexConst = {
    DATE          : /\*【日記】\*([^\n]+)/,
    WORKING_TIME  : /\*【時間】\*([^\n]+)/,
    WORKING_PLACE : /\*【場所】\*([^\n]+)/,
    WORKREPORT   : /\*【業務内容】\*([\s\S]*?)\*【自己評価】\*/,
    EVALUATION    : /\*【自己評価】\*([\s\S]*?)\*【翌日の計画】\*/,
    PLAN          : /\*【翌日の計画】\*([\s\S]*?)\*【その他】\*/,
    OTHER         : /\*【その他】\*([\s\S]*)/,
    THREAD        : /\*【壁】\*([^\n]+)/,
    THREADCOMMANDS    :   {
        AI_FEEDBACK : /\/AIフィードバック/,
    },
};