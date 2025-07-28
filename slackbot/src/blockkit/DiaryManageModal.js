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
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
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
				"style": "primary",
				"value": "click_me_123"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":clipboard: *List of events*\nChoose from different event lists"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Choose list",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "My events",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "All events",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Event invites",
							"emoji": true
						},
						"value": "value-1"
					}
				]
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":gear: *Settings*\nManage your notifications and team settings"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Edit settings",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Notifications",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Team settings",
							"emoji": true
						},
						"value": "value-1"
					}
				]
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Send feedback",
						"emoji": true
					},
					"value": "click_me_123"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "FAQs",
						"emoji": true
					},
					"value": "click_me_123"
				}
			]
		}
	]