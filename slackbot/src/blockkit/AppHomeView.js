// ホームタブのBlockKit定義
const { ModalConst } = require('../constants/ModalConst');

exports.AppHomeView = () => ({
    type : "home",
    blocks: [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: "timesmanager"
			}
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*日報管理*"
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
					style: "primary",
					value: "edit_diary"
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						text: "勤怠記録",
						emoji: true
					},
					style: "primary",
					value: "attendance_report"
				}
			]
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
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
				action_id : ModalConst.ACTION_ID.WORKREPORT.UPDATE,
				text: {
					type: "plain_text",
					text: "Edit",
					emoji: true
				},
				value: "task1"
			}
		},
		{ type: "divider" },
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
		{ type: "divider"},
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