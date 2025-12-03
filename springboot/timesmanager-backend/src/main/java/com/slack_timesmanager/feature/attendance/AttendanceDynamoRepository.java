package com.slack_timesmanager.feature.attendance;

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
import com.slack_timesmanager.feature.attendance.dto.AttendanceRequest;
import com.slack_timesmanager.feature.attendance.dto.AttendanceResponse;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@Repository
public class AttendanceDynamoRepository extends DynamoRepositoryBase{

    // ===== 属性名の定数 =====
    private static final String ATTR_USER_ID    = "user_id";
    private static final String ATTR_DATE       = "date";
    private static final String ATTR_START_TIME  = "start_time";
    private static final String ATTR_END_TIME    = "end_time";
    private static final String ATTR_WORKPLACE  = "workplace";
    
	
	public AttendanceDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		super(dynamoDbClient,tableName);
	}

	
    /**
     * 勤怠情報を保存
     */
    public boolean putItem(AttendanceRequest request){
    	DynamoKey itemKey = DynamoKeyFactory.attendanceItemKey(
                request.getUserId(),
                request.getDate()
        );

        Map<String, AttributeValue> item = new HashMap<>();
        item.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        item.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());
        item.put(ATTR_USER_ID, AttributeValue.builder().s(request.getUserId()).build());
        item.put(ATTR_DATE, AttributeValue.builder().s(request.getDate()).build());
        item.put(ATTR_START_TIME, AttributeValue.builder().s(request.getStartTime()).build());
        item.put(ATTR_END_TIME, AttributeValue.builder().s(request.getEndTime()).build());
        item.put(ATTR_WORKPLACE, AttributeValue.builder().s(request.getWorkplace()).build());

        PutItemRequest putItemRequest = PutItemRequest.builder()
            .tableName(tableName)
            .item(item)
            .build();

        try {
            dynamoDbClient.putItem(putItemRequest);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("DynamoDB putItem failed", e);
        }
    }
    
    /**
     * 勤怠情報をアップデート
     */
	public void updateItem(AttendanceRequest request) throws Exception {
    	DynamoKey itemKey = DynamoKeyFactory.attendanceItemKey(
                request.getUserId(),
                request.getDate()
        );
	    
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        key.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());

	    Map<String, String> expressionAttributeNames = new HashMap<>();
	    expressionAttributeNames.put("#st", ATTR_START_TIME);
	    expressionAttributeNames.put("#et", ATTR_END_TIME);
	    expressionAttributeNames.put("#wp", ATTR_WORKPLACE);

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
    
    /**
     * 勤怠情報を1件取得（PK+SKでユニーク）
     * 返り値は既存互換のため List<AttendanceResponse> としている
     */
    public List<AttendanceResponse> findByUserIdAndDate(String userId, String date) throws DynamoDbException{
    	DynamoKey itemKey = DynamoKeyFactory.attendanceItemKey(
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

            return List.of(mapToAttendanceResponse(item));

        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB getDiary failed", e);
        }
    }
    
    /**
     * ユーザIDに紐づく勤怠情報を全件取得する
     */
	public List<AttendanceResponse> findAllByUserId(String userId) {
		String partitionKey = DynamoKeyFactory.attendancePartitionKey(userId);

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
	                .map(this::mapToAttendanceResponse)
	                .collect(Collectors.toList());
	    }
	    catch (DynamoDbException e) {
	        throw new RuntimeException("DynamoDB queryTaskList failed", e);
	    }
	}
    
	/**
	 * DynamoDB 1アイテム → AttendanceResponse 変換
	 */
	private AttendanceResponse mapToAttendanceResponse(Map<String, AttributeValue> item) {
		AttendanceResponse response = new AttendanceResponse();
		
		response.setUserId(item.get(ATTR_USER_ID).s());
		response.setDate(item.get(ATTR_SK).s());
		response.setStartTime(item.get(ATTR_START_TIME).s());
		response.setEndTime(item.get(ATTR_END_TIME).s());
		response.setWorkplace(item.get(ATTR_WORKPLACE).s());
		
	    return response;
	}
}
