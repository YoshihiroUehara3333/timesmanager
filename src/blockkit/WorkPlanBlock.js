// 作業予定入力時のBlockKit定義
const { ModalConst } = require('../constants/ModalConst');

exports.WorkPlanBlock = (userId, taskName, goal, selectedTime, memo) => ([
    {
        type : "section",
        text : {
            type : "mrkdwn",
            text : `<@${userId}>\n📝*作業記録*`,
        }
    },
    {
        type   : "section",
        fields : [
            {
                type : "mrkdwn",
                text : `*タスク名*\n${taskName}`
            },
            {
                type : "mrkdwn",
                text : `*完了条件*\n${goal}`
            },
            {
                type : "mrkdwn",
                text : `*目標時間*\n${selectedTime}`
            },
            {
                type : "mrkdwn",
                text : `*備考*\n${memo}`
            },
        ]
    },
    {
        type     : "actions",
        elements : [
            {
                type : "button",
                text : {
                    type  : "plain_text",
                    emoji : true,
                    text  : "更新"
                },
                style     : "primary",
                value     : "update",
                action_id : ModalConst.ACTION_ID.WORKREPORT.UPDATE,
            },
            {
                type : "button",
                text : {
                    type  : "plain_text",
                    emoji : true,
                    text  : "業務終了"
                },
                style     : "danger",
                value     : "finish",
                action_id : ModalConst.ACTION_ID.WORKREPORT.FINISH,
            }
        ]
    }
]);