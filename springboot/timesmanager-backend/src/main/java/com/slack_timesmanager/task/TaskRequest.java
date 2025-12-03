package com.slack_timesmanager.task;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest implements Request{
	private String userId;
	private String date;
	private String taskName;
	private String targetTime;
	private String memo;
	private String channelId;
	private String status;
	private String serial;
	private String threadTs;
	private String createdAt;
	private String updatedAt;
	private String finishedAt;
	
	public TaskRequest() {
	}
}
