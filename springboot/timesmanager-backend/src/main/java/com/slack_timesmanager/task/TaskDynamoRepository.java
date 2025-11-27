package com.slack_timesmanager.task;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.slack_timesmanager.base.DynamoRepositoryBase;
import com.slack_timesmanager.enums.DynamoPK;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

@Repository
public class TaskDynamoRepository extends DynamoRepositoryBase{
	
    // ===== 属性名の定数 =====
    private static final String ATTR_USER_ID    = "userId";
    private static final String ATTR_DATE       = "date";
    private static final String ATTR_TASK_NAME  = "taskName";
    private static final String ATTR_CHANNEL_ID = "channelId";
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
        String partitionKey = DynamoPK.TASK.getPartitionKey(request.getUserId());
        String sortKey = request.getDate() + request.getSerial();

        Map<String, AttributeValue> item = Map.of(
                ATTR_PK,         AttributeValue.builder().s(partitionKey).build(),
                ATTR_SK,         AttributeValue.builder().s(sortKey).build(),
                ATTR_USER_ID,    AttributeValue.builder().s(request.getUserId()).build(),
                ATTR_DATE,       AttributeValue.builder().s(request.getDate()).build(),
                ATTR_TASK_NAME,  AttributeValue.builder().s(request.getTaskName()).build(),
                ATTR_CHANNEL_ID, AttributeValue.builder().s(request.getChannelId()).build(),
                ATTR_STATUS,     AttributeValue.builder().s(request.getStatus()).build(),
                ATTR_SERIAL,     AttributeValue.builder().s(request.getSerial()).build()
        );

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
	    String partitionKey = DynamoPK.TASK.getPartitionKey(userId);

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
	    String partitionKey = DynamoPK.TASK.getPartitionKey(userId);

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
