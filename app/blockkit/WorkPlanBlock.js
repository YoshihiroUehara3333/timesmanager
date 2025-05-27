// 作業予定入力時のBlockKit定義
exports.WorkPlanBlock = (user_id, content) => ([
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `<@${userId}>\n📝作業計画\n${content}`,
			}
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: "*Type:*\nComputer (laptop)"
				},
				{
					type: "mrkdwn",
					text: "*When:*\nSubmitted Aut 10"
				},
				{
					type: "mrkdwn",
					text: "*Last Update:*\nMar 10, 2015 (3 years, 5 months)"
				},
				{
					type: "mrkdwn",
					text: "*Reason:*\nAll vowel keys aren't working."
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