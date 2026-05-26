package com.timesmanager.api.feature.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timesmanager.api.common.exception.InfrastructureException;
import com.timesmanager.api.feature.task.domain.TaskDomain;
import com.timesmanager.api.feature.task.domain.TaskDomainFactory;
import com.timesmanager.api.feature.task.dto.TaskRequest;
import com.timesmanager.api.feature.task.dto.TaskResponse;

import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

@Service
public class TaskService {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(TaskService.class);
	
	private final TaskDynamoRepository taskDynamoRepository;

	public TaskService(TaskDynamoRepository taskDynamoRepository) {
		this.taskDynamoRepository = taskDynamoRepository;
	}

	
    /**
     * タスク入力
     * @param request
	 * @return
     */
	public TaskResponse create(TaskRequest request) {
		log.info("TaskService.save: request = {}", request);
		
		try {
			// シリアル発行
			String serial = taskDynamoRepository.getNextSerial(request.getUserId(), request.getDate());
			request.setSerial(serial);
			
			TaskDomain task = TaskDomainFactory.fromTaskRequest(request);
		    taskDynamoRepository.updateItem(task);
		    
		    return TaskResponse.fromDomain(task);
		}
		catch(DynamoDbException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("DynamoDB updateItem failed", e);
		}
	}
	
    /**
     * ユーザIDに紐づくタスクを全件取得
     * @param userId
	 * @return
     */
	public List<TaskResponse> getAllByUserId(String userId) {
		log.info("TaskService.getAllByUserId: userId={}", userId);
        
		try {
			return taskDynamoRepository.findAllByUserId(userId).stream()
					.map((task) -> TaskResponse.fromDomain(task))
					.toList();
		}
		catch(DynamoDbException e) {
	        log.error("DynamoDB処理中にエラー: getAllByUserId userId={}", userId, e);
	        throw new InfrastructureException("タスク一覧の取得に失敗しました", e);
		}
	};
	
    /**
     * ユーザID + 日付でタスクを取得
     * @param userId
	 * @param date
	 * @return
     */
	public List<TaskResponse> getByUserIdAndDate(String userId, String date) {
		log.info("TaskService.getByUserIdAndDate: userId={}, date={}", userId, date);
        
		try {
			List<TaskDomain> tasks = taskDynamoRepository.findByUserIdAndDate(userId, date);
			return tasks.stream()
					.map(TaskResponse::fromDomain)
					.toList();
		}
		catch(DynamoDbException e) {
            log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
            throw new InfrastructureException("タスク一覧の取得に失敗しました", e);
		}
	};
}
