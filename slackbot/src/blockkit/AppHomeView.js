// ホームタブのBlockKit定義
const { ModalConst } = require('../constants/ModalConst');

function dailyReportSection(){
	return [
        {
            type: "section",
            text: { type: "mrkdwn", text: "*日報管理*" }
		},
		{
            type: "actions",
            elements: [
                {
					type: "button",
					text: { type: "plain_text", text: "日報編集" },
					style: "primary",
					value: "home_dailyreport",
					action_id : ModalConst.ACTION_ID.HOME.DAILYREPORT,
				}
			]
		},
		{
            type: "actions",
            elements: [
                {
					type: "button",
					text: { type: "plain_text", text: "勤怠入力" },
					style: "primary",
					value: "home_attendance",
					action_id : ModalConst.ACTION_ID.HOME.ATTENDANCE,
				}
			]
		}
	]
}

function taskSection(){
    return [
        {
            type: "section",
            text: { type: "mrkdwn", text: "*タスク管理*" }
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: { type: "plain_text", text: "タスク新規作成" },
					style: "primary",
					value: "create_task",
					action_id : ModalConst.ACTION_ID.TASK.CREATE,
				}
			]
		},
		{
			type: "section",
			text: { type: "mrkdwn", text: "*タスク一覧*" }
		},
    ]
}

exports.AppHomeView = () => ({
    type : "home",
    blocks: [
		{
			type: "header",
			text: { type: "plain_text", text: "timesmanager" }
		},
		{ type: "divider" },
		...dailyReportSection(),
		{ type: "divider" },
		...taskSection(),
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: "*タスク1*"
			},
			accessory: {
				type: "button",
				action_id : ModalConst.ACTION_ID.TASK.UPDATE,
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
				text: "*タスク1*"
			},
			accessory: {
				type: "button",
				action_id : ModalConst.ACTION_ID.TASK.UPDATE,
				text: {
					type: "plain_text",
					text: "Edit",
					emoji: true
				},
				value: "task1"
			}
		}
    ]
});