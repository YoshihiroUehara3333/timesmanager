package com.timesmanager.api.feature.dailyreport.dto;

import com.timesmanager.api.common.core.dto.Response;
import com.timesmanager.api.feature.dailyreport.domain.DailyReport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyReportResponse implements Response{

	public DailyReportResponse() {
	}
	public DailyReportResponse(
			String userId,
			String channelId,
			String date, 
			String startTime, 
			String endTime,
			String workplace
	) {
		super();
		this.userId = userId;
		this.channelId = channelId;
		this.date = date;
		this.startTime = startTime;
		this.endTime = endTime;
		this.workplace = workplace;
	}
	
	
	public static DailyReportResponse fromDomain(DailyReport domain) {
		return new DailyReportResponse(
				
				);
	}
	
	private String userId;
	private String channelId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
}
