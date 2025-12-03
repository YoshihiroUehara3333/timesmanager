package com.slack_timesmanager.feature.task;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.slack_timesmanager.common.base.DynamoRepositoryBase;
import com.slack_timesmanager.dynamodb.DynamoKey;
import com.slack_timesmanager.dynamodb.DynamoKeyFactory;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

@Repository
public class TaskDynamoRepository extends DynamoRepositoryBase{
	
    // ===== 属性名の定数 =====
    private static final String ATTR_USER_ID    = "user_id";
    private static final String ATTR_DATE       = "date";
    private static final String ATTR_TASK_NAME  = "task_name";
    private static final String ATTR_CHANNEL_ID = "channel_id";
    private static final String ATTR_STATUS     = "status";
    private static final String ATTR_SERIAL     = "serial";
    
	
	public TaskDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		super(dynamoDbClient,tableName);
	}

    /**
     * タスクを1件保存
     */
    public boolean putItem(TaskRequest request) {
    	DynamoKey itemKey = DynamoKeyFactory.taskItemKey(
                request.getUserId(),
                request.getDate(),
                request.getSerial()
        );

    	Map<String, AttributeValue> item = new HashMap<>();
        item.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        item.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());
        item.put(ATTR_USER_ID,    AttributeValue.builder().s(request.getUserId()).build());
        item.put(ATTR_DATE,       AttributeValue.builder().s(request.getDate()).build());
        item.put(ATTR_TASK_NAME,  AttributeValue.builder().s(request.getTaskName()).build());
        item.put(ATTR_CHANNEL_ID, AttributeValue.builder().s(request.getChannelId()).build());
        item.put(ATTR_STATUS,     AttributeValue.builder().s(request.getStatus()).build());
        item.put(ATTR_SERIAL,     AttributeValue.builder().s(request.getSerial()).build());

        PutItemRequest putRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        try {
            dynamoDbClient.putItem(putRequest);
            return true;
        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB putItem failed", e);
        }
    }

    /**
     * ユーザIDに紐づくタスクを全件取得する
     */
	public List<TaskResponse> findAllByUserId(String userId) {
	    String partitionKey = DynamoKeyFactory.taskPartitionKey(userId);

	    // :pk プレースホルダーにパーティションキーをバインド
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
	                .map(this::mapToTaskResponse)
	                .collect(Collectors.toList());
	    }
	    catch (DynamoDbException e) {
	        // チェック例外を表に出さず RuntimeException に包んで上位に任せる
	        throw new RuntimeException("DynamoDB queryTaskList failed", e);
	    }
	}
	
    /**
     * ユーザIDと日付からタスク情報を取得する
     */
	public List<TaskResponse> findByUserIdAndDate(String userId, String date) {
		String partitionKey = DynamoKeyFactory.taskPartitionKey(userId);

	    // プレースホルダーにバインド
	    Map<String, AttributeValue> eav = Map.of(
	            ":pk", AttributeValue.builder().s(partitionKey).build(),
	            ":sk", AttributeValue.builder().s(date).build()
	    );

	    QueryRequest queryRequest = QueryRequest.builder()
	            .tableName(tableName)
	            .keyConditionExpression(ATTR_PK + "= :pk AND begins_with(" + ATTR_SK + ", :sk)")
	            .expressionAttributeValues(eav)
	            .build();

	    try {
	        QueryResponse response = dynamoDbClient.query(queryRequest);

	        if (response.items() == null || response.items().isEmpty()) {
	            // 「レコード0件」の時は null ではなく空Listを返す
	            return Collections.emptyList();
	        }

	        return response.items().stream()
	                .map(this::mapToTaskResponse)
	                .collect(Collectors.toList());
	    }
	    catch (DynamoDbException e) {
	        // チェック例外を表に出さず RuntimeException に包んで上位に任せる
	        throw new RuntimeException("DynamoDB queryTaskList failed", e);
	    }
	}
	

    /**
     * 指定ユーザ + 日付の「次の連番」を発行する
     * - その日付のタスクが1件もなければ "001"
     * - 既にあれば最大serial + 1 をゼロ埋めで返す
     */
    public String getNextSerial(String userId, String date) {
    	String partitionKey = DynamoKeyFactory.taskPartitionKey(userId);

        Map<String, AttributeValue> eav = Map.of(
                ":pk", AttributeValue.builder().s(partitionKey).build(),
                ":skPrefix", AttributeValue.builder().s(date).build()
        );

        QueryRequest queryRequest = QueryRequest.builder()
                .tableName(tableName)
                .keyConditionExpression(ATTR_PK + " = :pk AND begins_with(" + ATTR_SK + ", :skPrefix)")
                .expressionAttributeValues(eav)
                // sort_key 降順（最新が先頭）
                .scanIndexForward(false)
                .limit(1)
                .build();

        try {
            QueryResponse response = dynamoDbClient.query(queryRequest);

            if (response.items() == null || response.items().isEmpty()) {
                return "001";
            }

            Map<String, AttributeValue> latestItem = response.items().get(0);
            String currentSerial = latestItem.get(ATTR_SERIAL).s();

            int current = 0;
            try {
                current = Integer.parseInt(currentSerial);
            } catch (NumberFormatException e) {
                // 想定外の値が入っていた場合は 0 とみなして 001 から再スタート
                current = 0;
            }

            int next = current + 1;
            // 3桁ゼロ埋め
            return String.format("%03d", next);

        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB getNextSerial failed", e);
        }
    }

	

	/**
	 * DynamoDB 1アイテム → TaskResponse 変換
	 */
	private TaskResponse mapToTaskResponse(Map<String, AttributeValue> item) {
		TaskResponse response = new TaskResponse();
		
		response.setUserId(item.get(ATTR_USER_ID).s());
		response.setDate(item.get(ATTR_DATE).s());
		response.setTaskName(item.get(ATTR_TASK_NAME).s());
		response.setChannelId(item.get(ATTR_CHANNEL_ID).s());
		response.setStatus(item.get(ATTR_STATUS).s());
		response.setSerial(item.get(ATTR_SERIAL).s());
		
	    return response;
	}
}
