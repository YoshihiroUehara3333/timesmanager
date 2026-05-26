package com.timesmanager.api.feature.task.domain;

import com.timesmanager.api.common.core.Domain;

public record TaskProgressionDomain(
		String userId,
		String serial,
		String date,
		String time,
		String progress
		) implements Domain {
} 
