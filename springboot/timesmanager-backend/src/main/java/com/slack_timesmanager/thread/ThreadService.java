package com.slack_timesmanager.thread;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

@Service
public class ThreadService {
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
	
	private final ThreadDynamoRepository threadDynamoRepository;
	
	public ThreadService(ThreadDynamoRepository threadDynamoRepository) {
		this.threadDynamoRepository = threadDynamoRepository;
	}

	public ServiceResult<Void> save(ThreadRequest request){
		try {
			List<ThreadResponse> getRes = threadDynamoRepository.findByUserIdAndDate(request.getUserId(), request.getDate());
			
			if(getRes.isEmpty()) {
				threadDynamoRepository.putItem(request);
			} else {
				return ServiceResult.failure("今日のスレッドは既に作成済です");
			}
			
			return ServiceResult.success();
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	}
	
    /**
     * チャンネルIDに紐づくスレッド情報を全件取得
     */
	public ServiceResult<List<ThreadResponse>> getAllByUserId(String userId) {
		try {
			List<ThreadResponse> response = threadDynamoRepository.findAllByUserId(userId);
			return ServiceResult.success(response);
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: getAllByUserId userId={}", userId, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	};
	
	public ServiceResult<List<ThreadResponse>> getByUserIdAndDate(String userId, String date) {
		try {
			List<ThreadResponse> response = threadDynamoRepository.findByUserIdAndDate(userId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
			return ServiceResult.failure("DynamoDB error");
		}
	}
}
