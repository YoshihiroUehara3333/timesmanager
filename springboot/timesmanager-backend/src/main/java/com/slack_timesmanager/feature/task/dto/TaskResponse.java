package com.slack_timesmanager.feature.task.dto;

import com.slack_timesmanager.common.core.Response;
import com.slack_timesmanager.feature.task.domain.TaskDomain;

import lombok.Getter;

@Getter
public class TaskResponse implements Response {
	public TaskResponse() {
	}
	public TaskResponse(
			String userId, 
			String date, 
			String taskName, 
			String targetTime, 
			String memo, 
			String channelId,
			String status, 
			String serial, 
			String threadTs
	) {
		this.userId = userId;
		this.date = date;
		this.taskName = taskName;
		this.targetTime = targetTime;
		this.memo = memo;
		this.channelId = channelId;
		this.status = status;
		this.serial = serial;
		this.threadTs = threadTs;
	}
	
	
	public static TaskResponse fromDomain(TaskDomain domain) {
		return new TaskResponse(
				domain.userId(),
				domain.channelId(),
				domain.date(),
				domain.taskName(),
				domain.targetTime(),
				domain.memo(),
				domain.status(),
				domain.serial(),
				domain.threadTs()
				);
	}
	
	private String userId;
	private String date;
	private String taskName;
	private String targetTime;
	private String memo;
	private String channelId;
	private String status;
	private String serial;
	private String threadTs;

}
