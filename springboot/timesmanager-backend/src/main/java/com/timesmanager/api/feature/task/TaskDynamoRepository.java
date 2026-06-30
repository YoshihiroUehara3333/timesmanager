package com.timesmanager.api.feature.task;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;

import com.timesmanager.api.common.core.Repository;
import com.timesmanager.api.common.dynamodb.AbstractDynamoRepository;
import com.timesmanager.api.common.dynamodb.DynamoDbAttributeValueMapBuilder;
import com.timesmanager.api.common.dynamodb.DynamoKey;
import com.timesmanager.api.common.dynamodb.DynamoKeyFactory;
import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.feature.task.domain.Task;
import com.timesmanager.api.feature.task.domain.TaskFactory;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@org.springframework.stereotype.Repository
public class TaskDynamoRepository
        extends AbstractDynamoRepository
        implements Repository<Task>{
	
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
	    
        Map<String, AttributeValue> key = 
						        		new DynamoDbAttributeValueMapBuilder()
							                .putString(DynamoAttrName.PK.getValue(), itemKey.getPartitionKey())
							        		.putString(DynamoAttrName.SK.getValue(), itemKey.getSortKey())
							                .build();

	    Map<String, String> expressionAttributeNames = Map.of(
	    		"#userId"      ,DynamoAttrName.USER_ID.getValue()
	    		,"#serial"     ,DynamoAttrName.SERIAL.getValue()
	    		,"#date"       ,DynamoAttrName.DATE.getValue()
	    		,"#taskName"   ,DynamoAttrName.TASK_NAME.getValue()
	    		,"#memo"       ,DynamoAttrName.MEMO.getValue()
	    );
	    

	    Map<String, AttributeValue> expressionAttributeValues =
							            new DynamoDbAttributeValueMapBuilder()
							                    .putString(":userId", task.getUserId())
							                    .putString(":date", task.getDate())
							                    .putString(":taskName", task.getTaskName())
							                    .putString(":memo", task.getMemo())
							                    .putString(":serial", task.getSerial())
							                    .build();
	    
	    String updateExpression = 
			    	new StringBuilder()
		        		.append("SET #userId = :userId,")
		        		.append(" #channelId = :channelId,")
		        		.append(" #date = :date,")
		        		.append(" #taskName = :taskName,")
		        		.append(" #memo = :memo,")
		        		.append(" #serial = :serial")
		        		.toString();

	    UpdateItemRequest updateRequest = UpdateItemRequest.builder()
	        .tableName(tableName)
	        .key(key)
	        .updateExpression(updateExpression)
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
	            .keyConditionExpression(new StringBuilder(DynamoAttrName.PK.getValue()).append("= :pk").toString())
	            .expressionAttributeValues(eav)
	            .build();

	    try {
	        QueryResponse response = dynamoDbClient.query(queryRequest);

	        if (response.items() == null || response.items().isEmpty()) {
	            // 「レコード0件」の時は null ではなく空Listを返す
	            return Collections.emptyList();
	        }

	        return response.items().stream()
	        		.map(TaskFactory::from)
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
	            ":pk", buildAttrVal(partitionKey),
	            ":sk", buildAttrVal(date)
	    );

	    QueryRequest queryRequest = QueryRequest.builder()
	            .tableName(tableName)
	            .keyConditionExpression(
	            		new StringBuilder(DynamoAttrName.PK.getValue()).append("= :pk")
	            		.append(" AND begins_with ").append(DynamoAttrName.SK.getValue()).append(", :sk)")
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
	                .map(TaskFactory::from)
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
                .keyConditionExpression(DynamoAttrName.PK.getValue() + " = :pk AND begins_with(" + DynamoAttrName.SK.getValue() + ", :skPrefix)")
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
            String currentSerial = latestItem.get(DynamoAttrName.SERIAL.getValue()).s();

            int current = 0;
            current = Integer.parseInt(currentSerial);

            int next = current + 1;
            // 3桁ゼロ埋め
            return String.format("%03d", next);

        } catch (DynamoDbException e) {
            throw e;
        }
    }

	
	private DynamoKey getItemKeyFromDomain(Task task) {
		return DynamoKeyFactory.taskItemKey(
	            task.getUserId(),
	            task.getDate(),
	            task.getSerial()
	    );
	}
}
