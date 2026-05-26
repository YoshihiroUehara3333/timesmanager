package com.timesmanager.api.feature.dailyreport.domain;

import java.util.List;

import com.slack_timesmanager.common.core.Domain;

public record DailyReportDomain (
		List<String> taskNames,
		List<String> impressions
		) implements Domain {
	
}
