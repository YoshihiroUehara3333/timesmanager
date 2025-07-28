const { ModalConst } = require('../constants/ModalConst');

exports.DiaryManageModal = () => ({
	type: "modal",
	title: {
		type: "plain_text",
		text: "日報/勤怠管理",
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
				text: "*本日の日報/勤怠状況を入力してください*"
			}
		},
		{ type: "divider" },
		{
			type: "input",
			block_id: "starttime",
			label: {
				type: "plain_text",
				text: "開始時間"
			},
			element: {
				type: "timepicker",
				initial_time: "10:00",
				placeholder: {
					type: "plain_text",
					text: "開始時間を選択"
				},
				action_id: "start_time"
			}
		},
		{
			type: "input",
			block_id: "endtime",
			label: {
				type: "plain_text",
				text: "終了時間"
			},
			element: {
				type: "timepicker",
				initial_time: "19:00",
				placeholder: {
					type: "plain_text",
					text: "終了時間を選択"
				},
				action_id: "end_time"
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