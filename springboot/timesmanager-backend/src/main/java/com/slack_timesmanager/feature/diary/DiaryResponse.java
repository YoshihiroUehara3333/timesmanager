package com.slack_timesmanager.feature.diary;

import com.slack_timesmanager.common.core.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiaryResponse implements Response{
	private String userId;
	private String channelId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
	
	public DiaryResponse() {
	}
}
