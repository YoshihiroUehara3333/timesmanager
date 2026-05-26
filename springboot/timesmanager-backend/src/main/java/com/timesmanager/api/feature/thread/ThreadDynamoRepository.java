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
import com.timesmanager.api.common.exception.ConflictException;
import com.timesmanager.api.common.exception.InfrastructureException;
import com.timesmanager.api.dynamodb.DynamoDbItemBuilder;
import com.timesmanager.api.dynamodb.DynamoKey;
import com.timesmanager.api.dynamodb.DynamoKeyFactory;
import com.timesmanager.api.feature.thread.domain.ThreadDomain;

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

	// ===== 属性名の定数 =====
	private static final String ATTR_DATE = "date";
	private static final String ATTR_PERMALINK = "permalink";
	private static final String ATTR_THREADTS = "thread_ts";

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
	public void putItem(ThreadDomain thread) {
		DynamoKey itemKey = getItemKeyFromDomain(thread);

		Map<String, AttributeValue> item = new DynamoDbItemBuilder()
				.putString(ATTR_PK, itemKey.getPartitionKey())
				.putString(ATTR_SK, itemKey.getSortKey())
				.putString(ATTR_CHANNEL_ID, thread.getChannelId())
				.putString(ATTR_DATE, thread.getDate())
				.putString(ATTR_USER_ID, thread.getUserId())
				.putString(ATTR_THREADTS, thread.getThreadTs())
				.putString(ATTR_PERMALINK, thread.getPermalink())
				.build();

		PutItemRequest putItemRequest = PutItemRequest.builder()
				.tableName(tableName)
				.item(item)
				.conditionExpression("attribute_not_exists(" + ATTR_PK + ")")
				.build();

		try {
			dynamoDbClient.putItem(putItemRequest);
		} catch (ConditionalCheckFailedException e) {
			throw new ConflictException("PartitionKeyが重複しています。", e);
		} catch (DynamoDbException e) {
			throw new InfrastructureException("DynamoDB putItem failed", e);
		}
	}

	/**
     * スレッド情報を1件取得（PK+SKでユニーク）
     * @param
     * @return
     */
    public Optional<ThreadDomain> findByUserIdAndDate(ThreadDomain thread){
    	log.info("ThreadDynamoRepository.getByUserIdAndDate: userId={}, date={}",
    			thread.getUserId(),
    			thread.getDate());
    	
    	DynamoKey itemKey = getItemKeyFromDomain(thread);

    	Map<String, AttributeValue> key = new DynamoDbItemBuilder()
				.putString(ATTR_PK, itemKey.getPartitionKey())
				.putString(ATTR_SK, itemKey.getSortKey())
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
            return Optional.of(mapToThreadDomain(item));

        }
        catch (DynamoDbException e) {
        	throw new InfrastructureException("DynamoDB findByUserIdAndDate failed", e);
        }
    }

	/**
	 * チャンネルIDに紐づくスレッド情報を全件取得する
	 */
	public List<ThreadDomain> findAllByUserId(String userId) {
		String partitionKey = DynamoKeyFactory.threadPartitionKey(userId);

		Map<String, AttributeValue> eav = Map.of(
				":pk", AttributeValue.builder().s(partitionKey).build());

		QueryRequest queryRequest = QueryRequest.builder()
				.tableName(tableName)
				.keyConditionExpression(ATTR_PK + "= :pk")
				.expressionAttributeValues(eav)
				.build();

		try {
			QueryResponse response = dynamoDbClient.query(queryRequest);

			if (response.items() == null || response.items().isEmpty()) {
				// 「レコード0件」の時は null ではなく空Listを返す
				return Collections.emptyList();
			}

			return response.items().stream()
					.map(this::mapToThreadDomain)
					.collect(Collectors.toList());
		} catch (DynamoDbException e) {
			throw new InfrastructureException("DynamoDB findAllByUserId failed", e);
		}
	}

	/**
	 * DynamoDB 1アイテム → ThreadDomain 変換
	 */
	private ThreadDomain mapToThreadDomain(Map<String, AttributeValue> item) {
		return ThreadDomain.create(
				item.get(ATTR_CHANNEL_ID).s(),
				item.get(ATTR_DATE).s(),
				item.get(ATTR_USER_ID).s(),
				item.get(ATTR_THREADTS).s(),
				item.get(ATTR_PERMALINK).s());
	}

	private DynamoKey getItemKeyFromDomain(ThreadDomain domain) {
		return DynamoKeyFactory.threadItemKey(
				domain.getUserId(),
				domain.getDate());
	}
}
