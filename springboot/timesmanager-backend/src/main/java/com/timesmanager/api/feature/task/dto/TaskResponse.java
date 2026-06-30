package com.timesmanager.api.feature.task.dto;

import com.timesmanager.api.common.core.Response;
import com.timesmanager.api.feature.task.domain.Task;

import lombok.Getter;

@Getter
public class TaskResponse implements Response {
	private String userId;
	private String serial;
	private String date;
	private String taskName;
	private String memo;
	private String status;
	
	private TaskResponse(
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
	
	
	public static TaskResponse fromDomain(Task domain) {
		return new TaskResponse(
				domain.getUserId(),
				domain.getSerial(),
				domain.getDate(),
				domain.getTaskName(),
				domain.getMemo()
				);
	}
	

}
