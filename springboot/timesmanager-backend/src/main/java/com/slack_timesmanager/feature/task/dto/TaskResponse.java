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
			String serial, 
			String date, 
			String taskName, 
			String targetTime, 
			String memo, 
			String status
	) {
		this.userId = userId;
		this.date = date;
		this.taskName = taskName;
		this.targetTime = targetTime;
		this.memo = memo;
		this.status = status;
		this.serial = serial;
	}
	
	
	public static TaskResponse fromDomain(TaskDomain domain) {
		return new TaskResponse(
				domain.userId(),
				domain.serial(),
				domain.date(),
				domain.taskName(),
				domain.targetTime(),
				domain.memo(),
				domain.status()
				);
	}
	
	private String userId;
	private String serial;
	private String date;
	private String taskName;
	private String targetTime;
	private String memo;
	private String status;
}
