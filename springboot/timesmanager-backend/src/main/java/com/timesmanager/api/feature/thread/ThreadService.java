package com.timesmanager.api.feature.thread;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timesmanager.api.common.exception.InfrastructureException;
import com.timesmanager.api.common.utils.Validator;
import com.timesmanager.api.feature.thread.domain.ThreadDomain;
import com.timesmanager.api.feature.thread.domain.ThreadDomainFactory;
import com.timesmanager.api.feature.thread.dto.ThreadRequest;
import com.timesmanager.api.feature.thread.dto.ThreadResponse;

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
		
		if (!validateForCreate(request)) {
		}
		
		ThreadDomain thread = ThreadDomainFactory.fromRequest(request);

		threadDynamoRepository.putItem(thread);
		return ThreadResponse.fromDomain(thread);
	}
	/**
	 * 
	 * @param request
	 * @return
	 */
	private boolean validateForCreate (ThreadRequest request) {
		return true;
	}
	
	/**
	 * ユーザIDと日付でスレッド情報を取得
	 * @param userId
	 * @param date
	 * @return
	 */
	public Optional<ThreadResponse> getByUserIdAndDate(ThreadRequest request) {
		log.info("ThreadService.getByUserIdAndDate: userId={}, date={}", request.getUserId(), request.getDate());
		
		ThreadDomain thread = ThreadDomainFactory.fromRequest(request);
        
		try {
			return threadDynamoRepository.findByUserIdAndDate(thread)
					.map(ThreadResponse::fromDomain);
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", request.getUserId(), request.getDate(), e);
			throw new InfrastructureException("DynamoDB error", e);
		}
	}
	
	
    /**
     * チャンネルIDに紐づくスレッド情報を全件取得
     * @param userId
     * @return
     */
	public List<ThreadResponse> getAllByUserId(ThreadRequest request) {
		log.info("ThreadService.getAllByUserId: userId={}", request.getUserId());
		
		Validator.validateUserId(request.getUserId());
		
		try {
			List<ThreadDomain> threads = threadDynamoRepository.findAllByUserId(request.getUserId());
			return threads.stream()
					.map(ThreadResponse::fromDomain)
					.toList();
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: getAllByUserId userId={}", request.getUserId(), e);
	        throw new InfrastructureException("DynamoDB error", e);
		}
	};
}
