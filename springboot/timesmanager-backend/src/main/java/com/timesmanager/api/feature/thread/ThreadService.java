package com.timesmanager.api.feature.thread;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timesmanager.api.common.exception.ConflictException;
import com.timesmanager.api.common.exception.InfrastructureException;
import com.timesmanager.api.feature.thread.domain.ThreadDomain;
import com.timesmanager.api.feature.thread.domain.ThreadDomainFactory;
import com.timesmanager.api.feature.thread.dto.ThreadCreateRequest;
import com.timesmanager.api.feature.thread.dto.ThreadGetRequest;
import com.timesmanager.api.feature.thread.dto.ThreadResponse;

import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

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
	public ThreadResponse create(ThreadCreateRequest request) {
		log.info("ThreadService.create: userId={}, date={}, channelId={}",
				request.getUserId(), request.getDate(), request.getChannelId());

		ThreadDomain thread = ThreadDomainFactory.fromCreateRequest(request);

		try {
			threadDynamoRepository.putItem(thread);
			return ThreadResponse.fromDomain(thread);
		}
		catch (ConditionalCheckFailedException e) {
			throw new ConflictException("PartitionKeyが重複しています。", e);
		}
		catch (DynamoDbException e) {
			log.error("DynamoDB処理中にエラー: create userId={}, date={}",
					request.getUserId(), request.getDate(), e);
			throw new InfrastructureException("DynamoDB putItem failed", e);
		}
	}

	
	/**
	 * ユーザIDと日付でスレッド情報を取得
	 * @param userId
	 * @param date
	 * @return
	 */
	public Optional<ThreadResponse> getByUserIdAndDate(ThreadGetRequest request) {
		log.info("ThreadService.getByUserIdAndDate: userId={}, date={}", 
				request.getUserId(), request.getDate());

		try {
			return threadDynamoRepository.findByUserIdAndDate(
						request.getUserId(),
						request.getDate())
					.map(ThreadResponse::fromDomain);
		}
		catch (DynamoDbException e) {
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", 
					request.getUserId(), request.getDate(),
					e);
			throw new InfrastructureException("DynamoDB findByUserIdAndDate failed", e);
		}
	}

	/**
	 * チャンネルIDに紐づくスレッド情報を全件取得
	 * @param userId
	 * @return
	 */
	public List<ThreadResponse> getAllByUserId(ThreadGetRequest request) {
		log.info("ThreadService.getAllByUserId: userId={}", request.getUserId());

		try {
			List<ThreadDomain> threads = threadDynamoRepository.findAllByUserId(request.getUserId());
			return threads.stream()
					.map(ThreadResponse::fromDomain)
					.toList();
		}
		catch (DynamoDbException e) {
			log.error("DynamoDB処理中にエラー: getAllByUserId userId={}",
					request.getUserId(),
					e);
			throw new InfrastructureException("DynamoDB findAllByUserId failed", e);
		}
	}
}
