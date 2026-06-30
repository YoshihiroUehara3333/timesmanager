package com.timesmanager.api.feature.thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timesmanager.api.common.exception.ConflictException;
import com.timesmanager.api.common.exception.InfrastructureException;
import com.timesmanager.api.feature.thread.domain.ThreadReply;
import com.timesmanager.api.feature.thread.domain.ThreadReplyFactory;
import com.timesmanager.api.feature.thread.dto.ThreadReplyPostRequest;
import com.timesmanager.api.feature.thread.dto.ThreadReplyResponse;
import com.timesmanager.api.feature.thread.repository.ThreadReplyRepository;
import com.timesmanager.api.feature.thread.repository.ThreadRepository;

import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

@Service
public class ThreadReplyService {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(ThreadReplyService.class);

	private final ThreadReplyRepository threadReplyRepository;
	private final ThreadRepository threadRepository;

	public ThreadReplyService(
			ThreadReplyRepository threadReplyRepository,
			ThreadRepository threadRepository
		) {
		this.threadReplyRepository = threadReplyRepository;
		this.threadRepository = threadRepository;
	}
	
	/**
	 * スレッド新規作成
	 * @param request
	 * @return
	 */
	public ThreadReplyResponse save(ThreadReplyPostRequest request) {
		log.info("ThreadReplyService.create: userId={}, date={}, channelId={}",
				request.getUserId(), request.getDate(), request.getChannelId());

		ThreadReply domain = ThreadReplyFactory.from(request);

		try {
			threadReplyRepository.save(domain);
			return ThreadReplyResponse.from(domain);
		}
		catch (ConditionalCheckFailedException e) {
			throw new ConflictException("PartitionKeyが重複しています。", e);
		}
		catch (DynamoDbException e) {
			log.error("DynamoDB処理中にエラー: create userId={}, date={}",
					request.getUserId(), request.getDate(), 
					e);
			throw new InfrastructureException("putItem", e);
		}
	}
}

