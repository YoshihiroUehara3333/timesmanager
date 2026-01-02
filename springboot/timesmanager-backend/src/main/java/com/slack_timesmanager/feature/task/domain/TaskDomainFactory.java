package com.slack_timesmanager.feature.task.domain;

import com.slack_timesmanager.feature.task.dto.TaskRequest;

public class TaskDomainFactory {
	public static TaskDomain fromTaskRequest (TaskRequest request) {
		return new TaskDomain(
				request.getUserId(),
				request.getChannelId(),
				request.getDate(),
				request.getTaskName(),
				request.getTargetTime(),
				request.getMemo(),
				request.getStatus(),
				request.getSerial(),
				request.getThreadTs()
			);
	}
}
