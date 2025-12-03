package com.slack_timesmanager.thread;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;

@Service
public class ThreadService {
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
	
	private final ThreadDynamoRepository threadDynamoRepository;
	
	public ThreadService(ThreadDynamoRepository threadDynamoRepository) {
		this.threadDynamoRepository = threadDynamoRepository;
	}

	public boolean save(ThreadRequest request){
		try {
			List<ThreadResponse> getRes = threadDynamoRepository.findByUserIdAndDate(request.getUserId(), request.getDate());
			
			if(getRes.isEmpty()) {
				threadDynamoRepository.putItem(request);
				return true;
			} else {
				return false;
			}
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("DynamoDB error");
		}
	}
	
    /**
     * チャンネルIDに紐づくスレッド情報を全件取得
     */
	public List<ThreadResponse> getAllByUserId(String userId) {
		validateUserId(userId);
		
		try {
			return threadDynamoRepository.findAllByUserId(userId);
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: getAllByUserId userId={}", userId, e);
	        throw new InfrastructureException("DynamoDB error");
		}
	};
	
	/**
	 * 
	 * @param userId
	 * @param date
	 * @return
	 */
	public List<ThreadResponse> getByUserIdAndDate(String userId, String date) {
        validateUserId(userId);
        validateDate(date);
        
		try {
			return threadDynamoRepository.findByUserIdAndDate(userId, date);
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
			throw new InfrastructureException("DynamoDB error");
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
