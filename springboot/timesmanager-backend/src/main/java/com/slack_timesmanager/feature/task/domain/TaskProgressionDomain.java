package com.slack_timesmanager.feature.task.domain;

import com.slack_timesmanager.common.core.Domain;

public record TaskProgressionDomain(
		String userId,
		String serial,
		String date,
		String time,
		String progress
		) implements Domain {
} 
