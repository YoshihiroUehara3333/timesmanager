package com.slack_timesmanager.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

@Service
public class TaskService {
	
	private static final Logger log = LoggerFactory.getLogger(TaskService.class);
	
	private final TaskDynamoRepository taskDynamoRepository;

	public TaskService(TaskDynamoRepository taskDynamoRepository) {
		this.taskDynamoRepository = taskDynamoRepository;
	}

    /**
     * ユーザIDに紐づくタスクを全件取得
     */
	public ServiceResult<List<TaskResponse>> getAllByUserId(String userId) {
		try {
			List<TaskResponse> response = taskDynamoRepository.findAllByUserId(userId);
			return ServiceResult.success(response);
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: getAllByUserId userId={}", userId, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	};
	
    /**
     * ユーザID + 日付でタスクを取得
     */
	public ServiceResult<List<TaskResponse>> getByUserIdAndDate(String userId, String date) {
		try {
			List<TaskResponse> response = taskDynamoRepository.findByUserIdAndDate(userId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {
            log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
            return ServiceResult.failure("DynamoDB error");
		}
	};
	
    /**
     * タスク登録
     */
	public ServiceResult<Void> save(TaskRequest request) {
		try {
		    taskDynamoRepository.putItem(request);
			return ServiceResult.success();
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	};
	
	public ServiceResult<TaskSerialResponse> issueSerial(String userId, String date){
        try {
            String serial = taskDynamoRepository.getNextSerial(userId, date);
            TaskSerialResponse body = new TaskSerialResponse(serial);
            return ServiceResult.success(body);
        } 
        catch (Exception e) {
            log.error("DynamoDB処理中にエラー: issueSerial userId={}, date={}", userId, date, e);
            return ServiceResult.failure("DynamoDB error");
        }
	}
}
