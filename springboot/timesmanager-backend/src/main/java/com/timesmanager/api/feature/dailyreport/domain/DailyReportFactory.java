package com.timesmanager.api.feature.dailyreport.domain;

import com.timesmanager.api.feature.dailyreport.dto.DailyReportRequest;

public class DailyReportFactory {
	
	public static DailyReport from (DailyReportRequest request) {
		return DailyReport.builder()
				.userId(request.getUserId())
				.channelId(request.getChannelId())
				.date(request.getDate())
				.build();
	}
}
