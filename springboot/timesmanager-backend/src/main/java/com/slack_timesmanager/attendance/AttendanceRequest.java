package com.slack_timesmanager.attendance;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequest implements Request{
	private String userId;
	private String channelId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
  
}
