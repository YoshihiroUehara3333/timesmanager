package com.timesmanager.api.feature.dailycontext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timesmanager.api.feature.task.TaskDynamoRepository;
import com.timesmanager.api.feature.thread.repository.ThreadDynamoRepository;

@Service
public class DailyContextService {
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(DailyContextService.class);
	
	private final ThreadDynamoRepository threadDynamoRepository;
	private final TaskDynamoRepository taskDynamoRepository;
	
	public DailyContextService (
			ThreadDynamoRepository threadDynamoRepository,
			TaskDynamoRepository taskDynamoRepository
			) {
		this.threadDynamoRepository = threadDynamoRepository;
		this.taskDynamoRepository  = taskDynamoRepository;
	}
}
