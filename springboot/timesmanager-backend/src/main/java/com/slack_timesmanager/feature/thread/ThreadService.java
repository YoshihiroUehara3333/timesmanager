package com.slack_timesmanager.feature.thread;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;
import com.slack_timesmanager.common.utils.Validator;
import com.slack_timesmanager.feature.thread.dto.ThreadRequest;
import com.slack_timesmanager.feature.thread.dto.ThreadResponse;

@Service
public class ThreadService {
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
	
	private final ThreadDynamoRepository threadDynamoRepository;
	
	public ThreadService(ThreadDynamoRepository threadDynamoRepository) {
		this.threadDynamoRepository = threadDynamoRepository;
	}

	/**
	 * 
	 * @param request
	 * @return
	 */
	public boolean save(ThreadRequest request){
		log.info("ThreadService.save: request = {}", request);
		
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
     * @param userId
     * @return
     */
	public List<ThreadResponse> getAllByUserId(String userId) {
		log.info("ThreadService.getAllByUserId: userId={}", userId);
		
		Validator.validateUserId(userId);
		
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
		log.info("ThreadService.getByUserIdAndDate: userId={}, date={}", userId, date);
		
		Validator.validateUserId(userId);
		Validator.validateDate(date);
        
		try {
			return threadDynamoRepository.findByUserIdAndDate(userId, date);
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
			throw new InfrastructureException("DynamoDB error");
		}
	}
	

}
