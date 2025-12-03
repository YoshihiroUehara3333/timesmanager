package com.slack_timesmanager.feature.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;
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
     * ユーザIDに紐づくタスクを全件取得
     * @param userId
	 * @return
     */
	public List<TaskResponse> getAllByUserId(String userId) {
		log.info("TaskService.getAllByUserId: userId={}", userId);
		
        validateUserId(userId);
        
		try {
			return taskDynamoRepository.findAllByUserId(userId);
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
		
        validateUserId(userId);
        validateDate(date);
        
		try {
			return taskDynamoRepository.findByUserIdAndDate(userId, date);
		}
		catch(RuntimeException e) {
            log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
            throw new InfrastructureException("タスク一覧の取得に失敗しました", e);
		}
	};
	
    /**
     * タスク登録
     * @param request
	 * @return
     */
	public void save(TaskRequest request) {
		log.info("TaskService.save: request = {}", request);
		
		try {
		    taskDynamoRepository.putItem(request);
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("タスクのDB登録に失敗しました", e);
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
		
        validateUserId(userId);
        validateDate(date);
        
        try {
            String serial = taskDynamoRepository.getNextSerial(userId, date);
            return new TaskSerialResponse(serial);
        } 
        catch (RuntimeException e) {
            log.error("DynamoDB処理中にエラー: issueSerial userId={}, date={}", userId, date, e);
            throw new InfrastructureException("新規シリアルの発行に失敗しました", e);
        }
	}
	
	
    // ===== helpers =====
    private void validateUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId は必須です");
        }
    }

    private void validateDate(String date) {
        if (date == null || date.isBlank()) {
            throw new IllegalArgumentException("date は必須です");
        }
    }
}
