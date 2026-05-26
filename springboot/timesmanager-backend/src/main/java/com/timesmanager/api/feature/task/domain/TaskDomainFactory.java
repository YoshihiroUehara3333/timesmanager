package com.timesmanager.api.feature.task.domain;

import com.timesmanager.api.feature.task.dto.TaskRequest;

public class TaskDomainFactory {
	public static TaskDomain fromTaskRequest (TaskRequest request) {
		return new TaskDomain(
				request.getUserId(),
				request.getSerial(),
				request.getDate(),
				request.getTaskName(),
				request.getMemo()
			);
	}
}
