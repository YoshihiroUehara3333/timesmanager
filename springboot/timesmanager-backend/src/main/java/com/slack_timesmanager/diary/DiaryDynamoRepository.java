package com.slack_timesmanager.diary;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@Repository
public class DiaryDynamoRepository {
	private final String PARTITION_KEY_BASE = "/DIARY";
	
    @Value("${aws.dynamodb.tableName}")
    private String tableName;
	
	private final DynamoDbClient dynamoDbClient;
	
	public DiaryDynamoRepository(DynamoDbClient dynamoDbClient) {
		this.dynamoDbClient = dynamoDbClient;
	}
	
    public DiaryResponse getDiary(String userId, String date) throws Exception{
        String partitionKey = userId + PARTITION_KEY_BASE;
        String sortKey = date;

        Map<String, AttributeValue> key = new HashMap<>();
        key.put("partition_key", AttributeValue.builder().s(partitionKey).build());
        key.put("sort_key", AttributeValue.builder().s(sortKey).build());

        GetItemRequest request = GetItemRequest.builder()
            .tableName(tableName)
            .key(key)
            .build();

        try {
            Map<String, AttributeValue> item = dynamoDbClient.getItem(request).item();
            if (item == null || item.isEmpty()) return null;

            return new DiaryResponse(
                item.get("userId").s(),
                item.get("startTime").s(),
                item.get("endTime").s(),
                item.get("workplace").s()
            );

        } catch (Exception e) {
            throw new Exception("DynamoDB getDiary failed", e);
        }
    }
    
    public void putItem(DiaryRequest request) throws Exception {
        String partitionKey = request.getUserId() + PARTITION_KEY_BASE;
        String sortKey = request.getDate();

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("partition_key", AttributeValue.builder().s(partitionKey).build());
        item.put("sort_key", AttributeValue.builder().s(sortKey).build());
        item.put("userId", AttributeValue.builder().s(request.getUserId()).build());
        item.put("startTime", AttributeValue.builder().s(request.getStartTime()).build());
        item.put("endTime", AttributeValue.builder().s(request.getEndTime()).build());
        item.put("workplace", AttributeValue.builder().s(request.getWorkplace()).build());

        PutItemRequest putItemRequest = PutItemRequest.builder()
            .tableName(tableName)
            .item(item)
            .build();

        try {
            dynamoDbClient.putItem(putItemRequest);
        } catch (Exception e) {
            throw new Exception("DynamoDB putItem failed", e);
        }
    }
    
	public void updateItem(DiaryRequest request) throws Exception {
	    String partitionKey = request.getUserId() + PARTITION_KEY_BASE;
	    String sortKey = request.getDate();
	    
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("partition_key", AttributeValue.builder().s(partitionKey).build());
        key.put("sort_key", AttributeValue.builder().s(sortKey).build());

	    Map<String, String> expressionAttributeNames = new HashMap<>();
	    expressionAttributeNames.put("#st", "startTime");
	    expressionAttributeNames.put("#et", "endTime");
	    expressionAttributeNames.put("#wp", "workplace");

	    Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
	    expressionAttributeValues.put(":startTime", AttributeValue.builder().s(request.getStartTime()).build());
	    expressionAttributeValues.put(":endTime", AttributeValue.builder().s(request.getEndTime()).build());
	    expressionAttributeValues.put(":workplace", AttributeValue.builder().s(request.getWorkplace()).build());

	    UpdateItemRequest updateRequest = UpdateItemRequest.builder()
	        .tableName(tableName)
	        .key(key)
	        .updateExpression("SET #st = :startTime, #et = :endTime, #wp = :workplace")
	        .expressionAttributeNames(expressionAttributeNames)
	        .expressionAttributeValues(expressionAttributeValues)
	        .build();

	    try {
	        dynamoDbClient.updateItem(updateRequest);
	    } catch (Exception e) {
	        throw new Exception("DynamoDB updateItem failed", e);
	    }
	}
}
