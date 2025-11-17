package com.slack_timesmanager.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.slack_timesmanager.common.ServiceResult;

public class TaskService {
	private static final Logger log = LoggerFactory.getLogger(TaskService.class);
	private TaskDynamoRepository taskDynamoRepository;

	public TaskService(TaskDynamoRepository taskDynamoRepository) {
		this.taskDynamoRepository = taskDynamoRepository;
	}
	
	public ServiceResult getAll() {
		return null;
	};
	
	public ServiceResult getAllByUserId(String userId) {
		return null;
	};
	
	public ServiceResult getByUserIdAndDate(String userId, String date) {
		return null;
		
	};
	
	public ServiceResult save() {
		return null;
	};
}
