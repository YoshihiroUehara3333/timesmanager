const { ModalConst } = require('../constants/ModalConst');

exports.DailyReportInputModal = ({userId}) => ({
	type: "modal",
	callback_id : ModalConst.CALLBACK_ID.DAILYREPORT,
	private_metadata: JSON.stringify({
		user_id    : userId,
    }),
	title: {
		type: "plain_text",
		text: "日報入力",
		emoji: true
	},
	submit: {
		type: "plain_text",
		text: "Submit",
		emoji: true
	},
	close: {
		type: "plain_text",
		text: "Cancel",
		emoji: true
	},
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*本日の日報編集*"
			}
		},
		{ type: "divider" },
		{
			type     : "input",
			block_id : "task",
			label : {
				type : "plain_text",
				text : "タスク"
			},
			element : {
				type      : "plain_text_input",
				multiline : true,
				action_id : "input"
			}
		},
		{
			type     : "input",
			block_id : "taskname",
			label : {
				type : "plain_text",
				text : "タスク名"
			},
			element : {
				type      : "plain_text_input",
				multiline : true,
				action_id : "input"
			}
		},
		{
			type: "input",
			block_id: "workplace",
			label: {
				type: "plain_text",
				text: "作業場所"
			},
			element: {
				type: "static_select",
				placeholder: {
					type: "plain_text",
					text: "選択してください",
					emoji: true
				},
				options: [
					{
						text: {
							type: "plain_text",
							text: "出社",
							emoji: true
						},
						value: "onsite"
					},
					{
						text: {
							type: "plain_text",
							text: "リモート",
							emoji: true
						},
						value: "remote"
					},
					{
						text: {
							type: "plain_text",
							text: "休暇",
							emoji: true
						},
						value: "vacation"
					}
				],
				action_id: "select_workplace"
			}
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "フィードバックを送信",
						emoji: true
					},
					value: "send_feedback",
					action_id: "send_feedback"
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "よくある質問",
						emoji: true
					},
					value: "show_faq",
					action_id: "show_faq"
				}
			]
		}
	]
});