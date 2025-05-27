// 作業予定入力時のBlockKit定義
exports.WorkPlanBlock = (user_id, work_plan, seleted_time) => ([
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
					text: `*作業内容*\n${work_plan}`
				},
				{
					type: "mrkdwn",
					text: `*完了目標*\n${selected_time}`
				}
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
					value: "done"
				},
				{
					type: "button",
					text: {
						type: "plain_text",
						emoji: true,
						text: "やめた"
					},
					style: "danger",
					value: "cancel"
				}
			]
		}
	]);