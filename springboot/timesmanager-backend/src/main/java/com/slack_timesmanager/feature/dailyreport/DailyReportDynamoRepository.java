package com.slack_timesmanager.feature.dailyreport;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.slack_timesmanager.common.base.DynamoRepositoryBase;
import com.slack_timesmanager.dynamodb.DynamoKey;
import com.slack_timesmanager.dynamodb.DynamoKeyFactory;
import com.slack_timesmanager.feature.dailyreport.dto.DailyReportRequest;
import com.slack_timesmanager.feature.dailyreport.dto.DailyReportResponse;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@Repository
public class DailyReportDynamoRepository extends DynamoRepositoryBase{
	
    // ===== 属性名の定数 =====
    private static final String ATTR_USER_ID    = "user_id";
    private static final String ATTR_CHANNEL_ID = "channel_id";
	
	public DailyReportDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		super(dynamoDbClient,tableName);
	}
	
    /**
     * 日報を1件保存
     */
    public void putItem(DailyReportRequest request) {
    	DynamoKey itemKey = DynamoKeyFactory.dailyreportItemKey(
                request.getUserId(),
                request.getDate()
        );

        Map<String, AttributeValue> item = new HashMap<>();
        item.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        item.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());
        item.put(ATTR_USER_ID, AttributeValue.builder().s(request.getUserId()).build());
        item.put(ATTR_CHANNEL_ID, AttributeValue.builder().s(request.getChannelId()).build());

        PutItemRequest putItemRequest = PutItemRequest.builder()
            .tableName(tableName)
            .item(item)
            .build();

        try {
            dynamoDbClient.putItem(putItemRequest);
        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB putItem failed", e);
        }
    }
	
    /**
     * 日報を1件取得（PK+SKでユニーク）
     * 返り値は既存互換のため List<DiaryResponse> としている
     */
    public List<DailyReportResponse> getDiary(String userId, String date){
    	DynamoKey itemKey = DynamoKeyFactory.dailyreportItemKey(
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
            if (item == null || item.isEmpty()) {
	            // 「レコード0件」の時は null ではなく空Listを返す
	            return Collections.emptyList();
            }

            return List.of(mapToDiaryResponse(item));

        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB getDiary failed", e);
        }
    }
    
    
	public void updateItem(DailyReportRequest request){
    	DynamoKey itemKey = DynamoKeyFactory.dailyreportItemKey(
                request.getUserId(),
                request.getDate()
        );
	    
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        key.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());

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
	    } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB updateItem failed", e);
	    }
	}
	
	/**
	 * DynamoDB 1アイテム → TaskResponse 変換
	 */
	private DailyReportResponse mapToDiaryResponse(Map<String, AttributeValue> item) {
		DailyReportResponse response = new DailyReportResponse();
		
		response.setUserId(item.get(ATTR_USER_ID).s());
		response.setDate(item.get(ATTR_SK).s());
		
	    return response;
	}
}
