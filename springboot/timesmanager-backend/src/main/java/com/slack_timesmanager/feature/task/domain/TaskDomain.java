package com.slack_timesmanager.feature.task.domain;

import com.slack_timesmanager.common.core.Domain;

public record TaskDomain(
		String userId,
		String channelId,
		String date,
		String taskName,
		String targetTime,
		String memo,
		String status,
		String serial,
		String threadTs
	) implements Domain {

}
