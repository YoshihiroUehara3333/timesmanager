package com.timesmanager.api.feature.task.dto;

import com.slack_timesmanager.common.core.Response;
import com.timesmanager.api.feature.task.domain.TaskDomain;

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
			String memo
	) {
		this.userId = userId;
		this.date = date;
		this.serial = serial;
		this.taskName = taskName;
		this.memo = memo;
		
	}
	
	
	public static TaskResponse fromDomain(TaskDomain domain) {
		return new TaskResponse(
				domain.userId(),
				domain.serial(),
				domain.date(),
				domain.taskName(),
				domain.memo()
				);
	}
	
	private String userId;
	private String serial;
	private String date;
	private String taskName;
	private String memo;
	private String status;
}
