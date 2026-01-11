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
import com.slack_timesmanager.feature.task.domain.TaskDomain;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@Repository
public class TaskDynamoRepository extends DynamoRepositoryBase{
	
    // ===== 属性名の定数 =====
    private static final String ATTR_TASK_NAME  = "task_name";
    private static final String ATTR_TARGET_TIME = "target_time";
    private static final String ATTR_MEMO = "memo";
    private static final String ATTR_STATUS     = "status";
    private static final String ATTR_SERIAL     = "serial";
    private static final String ATTR_THREAD_TS = "thread_ts";
    
	
	public TaskDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		super(dynamoDbClient,tableName);
	}
    
    /**
     * 
     * 
     * @param task
     */
	public void updateItem(TaskDomain task){
		DynamoKey itemKey = getItemKeyFromDomain(task);
	    
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        key.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());

	    Map<String, String> expressionAttributeNames = new HashMap<>();
	    Map.of(
	    	ATTR_USER_ID       ,"#userId"
	    	,ATTR_SERIAL       ,"#serial"
	    	,ATTR_DATE         ,"#date"
	    	,ATTR_TASK_NAME    ,"#taskName" 
	    	,ATTR_TARGET_TIME  ,"#targetTime" 
	    	,ATTR_MEMO         ,"#memo" 
	    	,ATTR_STATUS       ,"#status" 
	    );

	    Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
	    expressionAttributeValues.put(":userId", AttributeValue.builder().s(task.userId()).build());
	    expressionAttributeValues.put(":date", AttributeValue.builder().s(task.date()).build());
	    expressionAttributeValues.put(":taskName", AttributeValue.builder().s(task.taskName()).build());
	    expressionAttributeValues.put(":targetTime", AttributeValue.builder().s(task.targetTime()).build());
	    expressionAttributeValues.put(":memo", AttributeValue.builder().s(task.memo()).build());
	    expressionAttributeValues.put(":status", AttributeValue.builder().s(task.status()).build());
	    expressionAttributeValues.put(":serial", AttributeValue.builder().s(task.serial()).build());

	    UpdateItemRequest updateRequest = UpdateItemRequest.builder()
	        .tableName(tableName)
	        .key(key)
	        .updateExpression(
	        		"SET #userId = :userId,"
	        		+ " #channelId = :channelId,"
	        		+ " #date = :date,"
	        		+ " #taskName = :taskName,"
	        		+ " #targetTime = :targetTime,"
	        		+ " #memo = :memo,"
	        		+ " #status = :status,"
	        		+ " #serial = :serial,"
	        		+ " #threadTs = :threadTs"
	        		)
	        .expressionAttributeNames(expressionAttributeNames)
	        .expressionAttributeValues(expressionAttributeValues)
	        .build();

	    try {
	        dynamoDbClient.updateItem(updateRequest);
	    } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB updateItem failed", e);
	    }
	}

    /**
     * ユーザIDに紐づくタスクを全件取得する
     */
	public List<TaskDomain> findAllByUserId(String userId) {
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
	                .map(this::mapToTaskDomain)
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
	public List<TaskDomain> findByUserIdAndDate(String userId, String date) {
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
	                .map(this::mapToTaskDomain)
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
	 * DynamoDB 1アイテム → TaskDomain 変換
	 */
	private TaskDomain mapToTaskDomain(Map<String, AttributeValue> item) {
	    return new TaskDomain(
	    		item.get(ATTR_USER_ID).s(),
	    		item.get(ATTR_SERIAL).s(),
				item.get(ATTR_DATE).s(),
				item.get(ATTR_TASK_NAME).s(),
				item.get(ATTR_TARGET_TIME).s(),
				item.get(ATTR_MEMO).s(),
				item.get(ATTR_STATUS).s()
	    		);
	}
	
	private DynamoKey getItemKeyFromDomain(TaskDomain task) {
		return DynamoKeyFactory.taskItemKey(
	            task.userId(),
	            task.date(),
	            task.serial()
	    );
	}
}
