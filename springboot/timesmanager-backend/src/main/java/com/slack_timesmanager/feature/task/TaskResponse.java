package com.slack_timesmanager.feature.task;

import com.slack_timesmanager.common.core.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskResponse implements Response{
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
	
	public TaskResponse() {
	}
}
