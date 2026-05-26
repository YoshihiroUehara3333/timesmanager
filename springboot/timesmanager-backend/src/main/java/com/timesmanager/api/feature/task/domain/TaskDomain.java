package com.timesmanager.api.feature.task.domain;

import com.slack_timesmanager.common.core.Domain;

public record TaskDomain(
		String userId,
		String serial,
		String date,
		String taskName,
		String memo
	) implements Domain {

}
