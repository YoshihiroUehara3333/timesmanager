package com.timesmanager.api.feature.task;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.timesmanager.api.common.base.DynamoRepositoryBase;
import com.timesmanager.api.dynamodb.DynamoDbAttributeValueMapBuilder;
import com.timesmanager.api.dynamodb.DynamoKey;
import com.timesmanager.api.dynamodb.DynamoKeyFactory;
import com.timesmanager.api.feature.task.domain.Task;

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
    private static final String ATTR_PROGRESS = "task_progressions";
    private static final String ATTR_MEMO = "memo";
    private static final String ATTR_SERIAL     = "serial";
    
	
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
	public void updateItem(Task task){
		DynamoKey itemKey = getItemKeyFromDomain(task);
	    
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        key.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());

	    Map<String, String> expressionAttributeNames = Map.of(
	    		"#userId"      ,ATTR_USER_ID
	    		,"#serial"     ,ATTR_SERIAL
	    		,"#date"       ,ATTR_DATE
	    		,"#taskName"   ,ATTR_TASK_NAME
	    		,"#memo"       ,ATTR_MEMO
	    );
	    

	    Map<String, AttributeValue> expressionAttributeValues =
	            new DynamoDbAttributeValueMapBuilder()
	                    .putString(":userId", task.getUserId())
	                    .putString(":date", task.getDate())
	                    .putString(":taskName", task.getTaskName())
	                    .putString(":memo", task.getMemo())
	                    .putString(":serial", task.getSerial())
	                    .build();

	    UpdateItemRequest updateRequest = UpdateItemRequest.builder()
	        .tableName(tableName)
	        .key(key)
	        .updateExpression(
	        		new StringBuilder()
	        		.append("SET #userId = :userId,")
	        		.append(" #channelId = :channelId,")
	        		.append(" #date = :date,")
	        		.append(" #taskName = :taskName,")
	        		.append(" #memo = :memo,")
	        		.append(" #serial = :serial")
	        		.toString())
	        .expressionAttributeNames(expressionAttributeNames)
	        .expressionAttributeValues(expressionAttributeValues)
	        .build();

	    try {
	        dynamoDbClient.updateItem(updateRequest);
	    } catch (DynamoDbException e) {
            throw e;
	    }
	}

    /**
     * ユーザIDに紐づくタスクを全件取得する
     */
	public List<Task> findAllByUserId(String userId) {
	    String partitionKey = DynamoKeyFactory.taskPartitionKey(userId);

	    // :pk プレースホルダーにパーティションキーをバインド
	    Map<String, AttributeValue> eav = Map.of(
	            ":pk", AttributeValue.builder().s(partitionKey).build()
	    );

	    QueryRequest queryRequest = QueryRequest.builder()
	            .tableName(tableName)
	            .keyConditionExpression(new StringBuilder(ATTR_PK).append("= :pk").toString())
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
	        throw e;
	    }
	}
	
    /**
     * ユーザIDと日付からタスク情報を取得する
     */
	public List<Task> findByUserIdAndDate(String userId, String date) {
		String partitionKey = DynamoKeyFactory.taskPartitionKey(userId);

	    // プレースホルダーにバインド
	    Map<String, AttributeValue> eav = Map.of(
	            ":pk", buildAttributeValue(partitionKey),
	            ":sk", buildAttributeValue(date)
	    );

	    QueryRequest queryRequest = QueryRequest.builder()
	            .tableName(tableName)
	            .keyConditionExpression(
	            		new StringBuilder(ATTR_PK).append("= :pk")
	            		.append(" AND begins_with ").append(ATTR_SK).append(", :sk)")
	            		.toString())
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
	        throw e;
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
            current = Integer.parseInt(currentSerial);

            int next = current + 1;
            // 3桁ゼロ埋め
            return String.format("%03d", next);

        } catch (DynamoDbException e) {
            throw e;
        }
    }

	

	/**
	 * DynamoDB 1アイテム → TaskDomain 変換
	 */
	private Task mapToTaskDomain(Map<String, AttributeValue> item) {
	    return Task.create(
	    		getString(item, ATTR_USER_ID),
	    		getString(item, ATTR_SERIAL),
	    		getString(item, ATTR_DATE),
	    		getString(item, ATTR_TASK_NAME),
	    		getString(item, ATTR_MEMO)
	    		);
	}
	
	private DynamoKey getItemKeyFromDomain(Task task) {
		return DynamoKeyFactory.taskItemKey(
	            task.getUserId(),
	            task.getDate(),
	            task.getSerial()
	    );
	}
}
