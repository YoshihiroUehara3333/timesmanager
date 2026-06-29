package com.timesmanager.api.feature.task.domain;

import com.timesmanager.api.feature.task.dto.TaskRequest;

public class TaskDomainFactory {
	public static Task fromTaskRequest (TaskRequest request) {
		return Task.create(
				request.getUserId(),
				request.getSerial(),
				request.getDate(),
				request.getTaskName(),
				request.getMemo()
			);
	}
}
