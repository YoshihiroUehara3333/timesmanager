package com.timesmanager.api.feature.thread.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.timesmanager.api.common.dynamodb.AbstractDynamoRepository;
import com.timesmanager.api.feature.thread.domain.ThreadReply;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

public class ThreadReplyDynamoRepository 
        extends AbstractDynamoRepository
        implements ThreadReplyRepository{

		/* Logger */
		private static final Logger log = LoggerFactory.getLogger(ThreadReplyDynamoRepository.class);

		public ThreadReplyDynamoRepository(
				DynamoDbClient dynamoDbClient,
				@Value("${aws.dynamodb.tableName}") String tableName) {
			super(dynamoDbClient, tableName);
		}

		@Override
		public void save(ThreadReply domain) {
			// TODO 自動生成されたメソッド・スタブ
			
		}

}
