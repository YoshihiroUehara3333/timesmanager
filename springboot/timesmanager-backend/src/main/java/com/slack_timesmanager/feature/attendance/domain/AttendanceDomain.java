package com.slack_timesmanager.feature.attendance.domain;

import com.slack_timesmanager.common.core.Domain;

public record AttendanceDomain (
		String userId,
		String date,
		String startTime,
		String endTime,
		String workplace
	) implements Domain {
}
