package com.slack_timesmanager.attendance;

import com.slack_timesmanager.common.core.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceResponse implements Response{
	private String userId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
	
	public AttendanceResponse() {
	}
}
