package com.timesmanager.api.feature.task.domain;

import java.util.Map;

import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.feature.task.dto.TaskRequest;

import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public class TaskFactory {
	
	public static Task from (TaskRequest request) {
		return Task.builder()
				.userId(request.getUserId())
				.date(request.getDate())
				.serial(request.getSerial())
				.taskName(request.getTaskName())
				.memo(request.getMemo())
				.build();
	}
	
	public static Task from (Map<String, AttributeValue> item) {
		return Task.builder()
				.userId(item.get(DynamoAttrName.CHANNEL_ID.getValue()).s())
				.date(item.get(DynamoAttrName.DATE.getValue()).s())
				.serial(item.get(DynamoAttrName.SERIAL.getValue()).s())
				.taskName(item.get(DynamoAttrName.TASK_NAME.getValue()).s())
				.memo(item.get(DynamoAttrName.MEMO.getValue()).s())
				.build();
	}
}
