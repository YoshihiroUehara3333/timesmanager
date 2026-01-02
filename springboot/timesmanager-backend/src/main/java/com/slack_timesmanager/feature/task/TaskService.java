package com.slack_timesmanager.feature.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;
import com.slack_timesmanager.common.utils.Validator;
import com.slack_timesmanager.feature.task.domain.TaskDomain;
import com.slack_timesmanager.feature.task.domain.TaskDomainFactory;
import com.slack_timesmanager.feature.task.dto.TaskRequest;
import com.slack_timesmanager.feature.task.dto.TaskResponse;
import com.slack_timesmanager.feature.task.dto.TaskSerialResponse;

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
	public TaskResponse save(TaskRequest request) {
		log.info("TaskService.save: request = {}", request);
		
		TaskDomain task = TaskDomainFactory.fromTaskRequest(request);
		
		try {
		    taskDynamoRepository.updateItem(task);
		    return TaskResponse.fromDomain(task);
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("タスクのDB登録に失敗しました", e);
		}
	}
	
    /**
     * ユーザIDに紐づくタスクを全件取得
     * @param userId
	 * @return
     */
	public List<TaskResponse> getAllByUserId(String userId) {
		log.info("TaskService.getAllByUserId: userId={}", userId);
		
		Validator.validateUserId(userId);
        
		try {
			List<TaskDomain> tasks = taskDynamoRepository.findAllByUserId(userId);
			return tasks.stream()
					.map(TaskResponse::fromDomain)
					.toList();
		}
		catch(RuntimeException e) {
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
		
		Validator.validateUserId(userId);
		Validator.validateDate(date);
        
		try {
			List<TaskDomain> tasks = taskDynamoRepository.findByUserIdAndDate(userId, date);
			return tasks.stream()
					.map(TaskResponse::fromDomain)
					.toList();
		}
		catch(RuntimeException e) {
            log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
            throw new InfrastructureException("タスク一覧の取得に失敗しました", e);
		}
	};
	
	
	/**
	 * シリアル発行
	 * @param userId
	 * @param date
	 * @return
	 */
	public TaskSerialResponse issueSerial(String userId, String date){
		log.info("TaskService.issueSerial: userId={}, date={}", userId, date);
		
		Validator.validateUserId(userId);
		Validator.validateDate(date);
        
        try {
            String serial = taskDynamoRepository.getNextSerial(userId, date);
            return new TaskSerialResponse(serial);
        } 
        catch (RuntimeException e) {
            log.error("DynamoDB処理中にエラー: issueSerial userId={}, date={}", userId, date, e);
            throw new InfrastructureException("新規シリアルの発行に失敗しました", e);
        }
	}
}
