// /makethread or /newtask実行時のモーダルBlockKit定義定義
const { ModalConst } = require('../constants/ModalConst');

exports.NewTaskModal = (channelId, threadTs, date, serial) => ({
	type        : "modal",
	callback_id : ModalConst.CALLBACK_ID.NEWTASK,
	private_metadata: JSON.stringify({
        channel_id : channelId,
		user_id    : userId,
        thread_ts  : threadTs,
        date       : date,
        serial     : serial
    }),
	title: {
		type : "plain_text",
		text : "進捗整理"
	},
	submit : {
		type : "plain_text",
		text : "送信"
	},
	close : {
		type : "plain_text",
		text : "キャンセル"
	},
	blocks : [
		{
			type     : "input",
			block_id : "taskname",
			label : {
				type : "plain_text",
				text : "タスク名"
			},
			element : {
				type      : "plain_text_input",
				action_id : "input"
			}
		},
		{
			type     : "input",
			block_id : "goal",
			label : {
				type : "plain_text",
				text : "完了条件"
			},
			element : {
				type      : "plain_text_input",
				action_id : "input"
			}
		},
		{
			type     : "input",
			block_id : "targettime",
			label : {
				type : "plain_text",
				text : "完了目標",
			},
			element : {
				type         : "timepicker",
				initial_time : "10:00",
				placeholder : {
					type  : "plain_text",
					text  : "Select time",
					emoji : true
				},
				action_id : "input"
			}
		},
		{ type : "divider" },
		{
			type     : "input",
            block_id : "memo",
			label : {
				type : "plain_text",
				text : "メモ",
			},
			element : {
				type      : "plain_text_input",
				multiline : true,
				action_id : "input"
			}
		}
	]
});