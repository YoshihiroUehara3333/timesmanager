package com.timesmanager.api.feature.thread;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.timesmanager.api.common.base.DynamoRepositoryBase;
import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.dynamodb.DynamoDbAttributeValueMapBuilder;
import com.timesmanager.api.dynamodb.DynamoKey;
import com.timesmanager.api.dynamodb.DynamoKeyFactory;
import com.timesmanager.api.feature.thread.domain.Thread;
import com.timesmanager.api.feature.thread.domain.ThreadFactory;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

@Repository
public class ThreadDynamoRepository extends DynamoRepositoryBase {

	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(ThreadDynamoRepository.class);

	public ThreadDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName) {
		super(dynamoDbClient, tableName);
	}

	/**
	 * スレッド情報を1件保存する
	 * @param
	 */
	public void putItem(Thread thread) {
		DynamoKey itemKey = getItemKeyFromDomain(thread);

		Map<String, AttributeValue> item = new DynamoDbAttributeValueMapBuilder()
				.putString(DynamoAttrName.PK.getValue(), itemKey.getPartitionKey())
				.putString(DynamoAttrName.SK.getValue(), itemKey.getSortKey())
				.putString(DynamoAttrName.CHANNEL_ID.getValue(), thread.getChannelId())
				.putString(DynamoAttrName.DATE.getValue(), thread.getDate())
				.putString(DynamoAttrName.USER_ID.getValue(), thread.getUserId())
				.putString(DynamoAttrName.THREAD_TS.getValue(), thread.getThreadTs())
				.putString(DynamoAttrName.PERMALINK.getValue(), thread.getPermalink())
				.build();

		PutItemRequest putItemRequest = PutItemRequest.builder()
				.tableName(tableName)
				.item(item)
				.conditionExpression("attribute_not_exists(" + DynamoAttrName.PK.getValue() + ")")
				.build();

		try {
			dynamoDbClient.putItem(putItemRequest);
		} catch (ConditionalCheckFailedException e) {
			throw e;
		} catch (DynamoDbException e) {
			throw e;
		}
	}

	/**
     * スレッド情報を1件取得（PK+SKでユニーク）
     * @param
     * @return
     */
    public Optional<Thread> findByUserIdAndDate(String userId, String date){
    	log.info("ThreadDynamoRepository.getByUserIdAndDate: userId={}, date={}",
    			userId, date);
    	
    	DynamoKey itemKey = DynamoKeyFactory.threadItemKey(userId, date);

    	Map<String, AttributeValue> key = new DynamoDbAttributeValueMapBuilder()
				.putString(DynamoAttrName.PK.getValue(), itemKey.getPartitionKey())
				.putString(DynamoAttrName.SK.getValue(), itemKey.getSortKey())
				.build();

        GetItemRequest request = GetItemRequest.builder()
            .tableName(tableName)
            .key(key)
            .build();

        try {
            Map<String, AttributeValue> item = dynamoDbClient.getItem(request).item();
            
            log.debug("raw response item = {}", item);
            
            if (item == null || item.isEmpty()) {
	            return Optional.empty();
            }
            return Optional.of(ThreadFactory.from(item));
        }
        catch (DynamoDbException e) {
        	throw e;
        }
    }

	/**
	 * チャンネルIDに紐づくスレッド情報を全件取得する
	 */
	public List<Thread> findAllByUserId(String userId) {
		String partitionKey = DynamoKeyFactory.threadPartitionKey(userId);

		Map<String, AttributeValue> eav = new DynamoDbAttributeValueMapBuilder()
				.putString(":pk", partitionKey)
				.build();

		QueryRequest queryRequest = QueryRequest.builder()
				.tableName(tableName)
				.keyConditionExpression(DynamoAttrName.PK.getValue() + "= :pk")
				.expressionAttributeValues(eav)
				.build();

		try {
			QueryResponse response = dynamoDbClient.query(queryRequest);

			if (response.items() == null || response.items().isEmpty()) {
				// 「レコード0件」の時は null ではなく空Listを返す
				return Collections.emptyList();
			}

			return response.items().stream()
					.map(ThreadFactory::from)
					.collect(Collectors.toList());
		}
		catch (DynamoDbException e) {
			throw e;
		}
	}


	private DynamoKey getItemKeyFromDomain(Thread domain) {
		return DynamoKeyFactory.threadItemKey(
				domain.getUserId(),
				domain.getDate());
	}
}
