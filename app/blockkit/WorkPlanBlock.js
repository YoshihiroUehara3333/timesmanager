// 作業予定入力時のBlockKit定義
const { ModalConst } = require('../constants/ModalConst');

exports.WorkPlanBlock = (user_id, work_plan, selected_time, option) => ([
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `<@${user_id}>\n📝*作業計画*`,
			}
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: `*作業予定*\n${work_plan}`
				},
				{
					type: "mrkdwn",
					text: `*完了目標*\n${selected_time}`
				},
				{
					type: "mrkdwn",
					text: `*備考*\n${option}`
				},
			]
		},
		{
			type: "actions",
			elements: [
				{
					type: "button",
					text: {
						type: "plain_text",
						emoji: true,
						text: "完了"
					},
					style: "primary",
					value: "finish",
					action_id: ModalConst.ACTION_ID.WORKPLAN.FINISH,
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						emoji: true,
						text: "やめた"
					},
					style: "danger",
					value: "cancel",
					action_id: ModalConst.ACTION_ID.WORKPLAN.CANCEL,
				}
			]
		}
	]);