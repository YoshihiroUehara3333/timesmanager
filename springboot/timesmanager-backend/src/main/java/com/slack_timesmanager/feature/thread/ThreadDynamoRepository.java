package com.slack_timesmanager.feature.thread;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.slack_timesmanager.common.base.DynamoRepositoryBase;
import com.slack_timesmanager.dynamodb.DynamoKey;
import com.slack_timesmanager.dynamodb.DynamoKeyFactory;
import com.slack_timesmanager.feature.thread.dto.ThreadRequest;
import com.slack_timesmanager.feature.thread.dto.ThreadResponse;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

@Repository
public class ThreadDynamoRepository extends DynamoRepositoryBase{
    // ===== 属性名の定数 =====
    private static final String ATTR_USER_ID    = "user_id";
    private static final String ATTR_CHANNEL_ID = "channel_id";
    private static final String ATTR_DATE       = "date";
    private static final String ATTR_PERMALINK = "permalink";
    private static final String ATTR_THREADTS = "thread_ts";

    /* Logger */
    private static final Logger log = LoggerFactory.getLogger(ThreadDynamoRepository.class);
    
	public ThreadDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		super(dynamoDbClient,tableName);
	}
	
	
    /**
     * スレッド情報を1件保存
     */
    public boolean putItem(ThreadRequest request) {
    	DynamoKey itemKey = DynamoKeyFactory.threadItemKey(
                request.getUserId(),
                request.getDate()
        );

        Map<String, AttributeValue> item = new HashMap<>();
        item.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        item.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());
        item.put(ATTR_CHANNEL_ID, AttributeValue.builder().s(request.getChannelId()).build());
        item.put(ATTR_USER_ID, AttributeValue.builder().s(request.getUserId()).build());
        item.put(ATTR_PERMALINK, AttributeValue.builder().s(request.getPermalink()).build());
        item.put(ATTR_THREADTS, AttributeValue.builder().s(request.getThreadTs()).build());

        PutItemRequest putItemRequest = PutItemRequest.builder()
            .tableName(tableName)
            .item(item)
            .build();

        try {
            dynamoDbClient.putItem(putItemRequest);
            return true;
        } catch (DynamoDbException e) {
        	throw new RuntimeException("DynamoDB putItem failed", e);
        }
    }
	
    /**
     * スレッド情報を1件取得（PK+SKでユニーク）
     * 返り値は既存互換のため List<ThreadResponse> としている
     */
    public List<ThreadResponse> findByUserIdAndDate(String userId, String date) throws DynamoDbException{
    	log.info("ThreadDynamoRepository.getByUserIdAndDate: userId={}, date={}", userId, date);
    	
    	DynamoKey itemKey = DynamoKeyFactory.threadItemKey(
                userId,
                date
        );

        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        key.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());

        GetItemRequest request = GetItemRequest.builder()
            .tableName(tableName)
            .key(key)
            .build();

        try {
            Map<String, AttributeValue> item = dynamoDbClient.getItem(request).item();
            log.debug("raw response item = {}", item); // 0件のとき {} か null か確認
            if (item == null || item.isEmpty()) {
	            // 「レコード0件」の時は null ではなく空Listを返す
	            return Collections.emptyList();
            }

            return List.of(mapToThreadResponse(item));

        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB getDiary failed", e);
        }
    }
    
    /**
     * チャンネルIDに紐づくスレッド情報を全件取得する
     */
	public List<ThreadResponse> findAllByUserId(String userId) {
		String partitionKey = DynamoKeyFactory.threadPartitionKey(userId);

	    Map<String, AttributeValue> eav = Map.of(
	            ":pk", AttributeValue.builder().s(partitionKey).build()
	    );

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
	                .map(this::mapToThreadResponse)
	                .collect(Collectors.toList());
	    }
	    catch (DynamoDbException e) {
	        throw new RuntimeException("DynamoDB queryTaskList failed", e);
	    }
	}
    
	/**
	 * DynamoDB 1アイテム → AttendanceResponse 変換
	 */
	private ThreadResponse mapToThreadResponse(Map<String, AttributeValue> item) {
		ThreadResponse response = new ThreadResponse();
		
		response.setUserId(item.get(ATTR_USER_ID).s());
		response.setDate(item.get(ATTR_SK).s());
		response.setChannelId(item.get(ATTR_CHANNEL_ID).s());
		response.setPermalink(item.get(ATTR_PERMALINK).s());
		response.setThreadTs(item.get(ATTR_THREADTS).s());
		
	    return response;
	}
}
