package com.slack_timesmanager.feature.thread;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;
import com.slack_timesmanager.common.utils.Validator;
import com.slack_timesmanager.feature.thread.domain.ThreadDomain;
import com.slack_timesmanager.feature.thread.domain.ThreadDomainFactory;
import com.slack_timesmanager.feature.thread.dto.ThreadRequest;
import com.slack_timesmanager.feature.thread.dto.ThreadResponse;

@Service
public class ThreadService {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
	
	private final ThreadDynamoRepository threadDynamoRepository;
	
	public ThreadService(ThreadDynamoRepository threadDynamoRepository) {
		this.threadDynamoRepository = threadDynamoRepository;
	}

	/**
	 * スレッド新規作成
	 * @param request
	 * @return
	 */
	public ThreadResponse create(ThreadRequest request){
		log.info("ThreadService.create: request = {}", request);
		
		ThreadDomain thread = ThreadDomainFactory.fromRequest(request);
		
		try {			
			threadDynamoRepository.putItem(thread);
			return ThreadResponse.fromDomain(thread);
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: create request={}", request, e);
	        throw new InfrastructureException("DynamoDB error", e);
		}
	}
	
	/**
	 * ユーザIDと日付でスレッド情報を取得
	 * @param userId
	 * @param date
	 * @return
	 */
	public Optional<ThreadResponse> getByUserIdAndDate(String userId, String date) {
		log.info("ThreadService.getByUserIdAndDate: userId={}, date={}", userId, date);
		
		Validator.validateUserId(userId);
		Validator.validateDate(date);
        
		try {
			return threadDynamoRepository.findByUserIdAndDate(userId, date)
					.map(ThreadResponse::fromDomain);
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
			throw new InfrastructureException("DynamoDB error", e);
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
			List<ThreadDomain> threads = threadDynamoRepository.findAllByUserId(userId);
			return threads.stream()
					.map(ThreadResponse::fromDomain)
					.toList();
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: getAllByUserId userId={}", userId, e);
	        throw new InfrastructureException("DynamoDB error", e);
		}
	};
}
