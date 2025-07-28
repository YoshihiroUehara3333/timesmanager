// ホームタブのBlockKit定義
const { ModalConst } = require('../constants/ModalConst');

exports.AppHomeView = () => ({
    type : "home",
    blocks: [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: "timesmanagerホーム"
			}
		},
		{
            type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "今日の日報を編集する",
						emoji: true
					},
					value: "edit_diary"
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "勤怠記録",
						emoji: true
					},
					value: "勤怠記録"
				}
			]
		},
		{
			type: "section",
			text: {
				type: "plain_text",
				text: "*タスク管理*"
			}
		},
		{
			type: "divider"
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*タスク一覧*"
			}
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*タスク1*"
			},
			accessory: {
				type: "button",
				text: {
					type: "plain_text",
					text: "Edit",
					emoji: true
				},
				value: "task1"
			}
		},
		{
			type: "divider"
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*タスク2*"
			},
			accessory: {
				type: "button",
				text: {
					type: "plain_text",
					text: "Edit",
					emoji: true
				},
				value: "task2"
			}
		},
		{
			type: "divider"
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "タスク新規作成",
						emoji: true
					},
					style: "primary",
					value: "create_task"
				}
			]
		}
    ]
});