// 日報入力モーダルBlockKit定義定義
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
				text: `本日の日報/勤怠状況`
			}
		},
		{ type: "divider" },
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: ":calendar: *勤務時間*\nCreate a new event"
			},
			accessory: {
				type: "button",
				text: {
					"type": "plain_text",
					"text": "Create event",
					"emoji": true
				},
				style: "primary",
				value: "click_me_123"
			}
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: ":clipboard: *作業場所を選択してください*"
			},
			accessory: {
				type: "static_select",
				placeholder: {
					type: "plain_text",
					text: "Choose list",
					emoji: true
				},
				options: [
					{
						text: {
							type: "plain_text",
							text: "出社",
							emoji: true
						},
						value: "1"
					},
					{
						text: {
							type: "plain_text",
							text: "出社",
							emoji: true
						},
						value: "1"
					},
					{
						text: {
							type: "plain_text",
							text: "出社",
							emoji: true
						},
						value: "1"
					}
				]
			}
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "Send feedback",
						emoji: true
					},
					value: "click_me_123"
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "FAQs",
						emoji: true
					},
					value: "click_me_123"
				}
			]
		}
	]
});