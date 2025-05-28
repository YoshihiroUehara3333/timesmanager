// /makethread実行時のモーダルBlockKit定義定義
const { ModalConst } = require('../constants/ModalConst');

exports.MakeThreadModal = (channel_id, thread_ts, date) => ({
    type: "modal",
    callback_id: ModalConst.CALLBACK_ID.MAKETHREAD,
    private_metadata: JSON.stringify({
        channel_id: channel_id,
        thread_ts: thread_ts,
        date: date,
    }),
    title: { 
        type: "plain_text", 
        text: "作業計画を入力",
    },
    submit: { 
        type: "plain_text", 
        text: "送信",
    },
    close: { 
        type: 'plain_text', 
        text: "キャンセル",
    },
    blocks: [
        {
            type: 'input',
            block_id: 'work_plan',
            label: { 
                type: "plain_text", 
                text: "作業予定",
            },
            element: {
                type: "plain_text_input",
                action_id: "work_plan",
            }
        },
        {
			type    : "input",
            block_id: 'timepicker',
			element : {
				type: "timepicker",
				initial_time: "10:00",
				placeholder: {
					type: "plain_text",
					text: "Select time",
					emoji: true
				},
				action_id: "timepicker"
			},
			label: {
				type: "plain_text",
				text: "完了予定",
				emoji: true
			}
		},
        {
            type: 'input',
            block_id: 'option',
            label: { 
                type: "plain_text", 
                text: "備考",
            },
            element: {
                type: "plain_text_input",
                action_id: "option",
            }
        },
    ]
});