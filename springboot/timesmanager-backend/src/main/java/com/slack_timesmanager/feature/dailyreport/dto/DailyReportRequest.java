package com.slack_timesmanager.feature.dailyreport.dto;

import jakarta.validation.constraints.NotBlank;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DailyReportRequest implements Request{
	@NotBlank
	private String userId;
	
	@NotBlank
	private String date;
	
	private String channelId;
	private String startTime;
	private String endTime;
	private String workplace;
}
