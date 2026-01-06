package com.slack_timesmanager.feature.attendance;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.slack_timesmanager.common.base.DynamoRepositoryBase;
import com.slack_timesmanager.dynamodb.DynamoKey;
import com.slack_timesmanager.dynamodb.DynamoKeyFactory;
import com.slack_timesmanager.feature.attendance.domain.AttendanceDomain;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
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
    
    /* Logger */
    private static final Logger log = LoggerFactory.getLogger(AttendanceDynamoRepository.class);
	
	public AttendanceDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		super(dynamoDbClient,tableName);
	}

    
    /**
     * 勤怠情報を保存
     */
	public void updateItem(AttendanceDomain domain) {
		DynamoKey itemKey = DynamoKeyFactory.attendanceItemKey(
                domain.userId(),
                domain.date()
        );
	    
        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(itemKey.getPartitionKey()).build());
        key.put(ATTR_SK, AttributeValue.builder().s(itemKey.getSortKey()).build());

	    Map<String, String> expressionAttributeNames = new HashMap<>();
	    expressionAttributeNames.put("#userId", ATTR_USER_ID);
	    expressionAttributeNames.put("#dt", ATTR_DATE);
	    expressionAttributeNames.put("#st", ATTR_START_TIME);
	    expressionAttributeNames.put("#et", ATTR_END_TIME);
	    expressionAttributeNames.put("#wp", ATTR_WORKPLACE);

	    Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
	    expressionAttributeValues.put(":date", AttributeValue.builder().s(domain.date()).build());
	    expressionAttributeValues.put(":userId", AttributeValue.builder().s(domain.userId()).build());
	    expressionAttributeValues.put(":startTime", AttributeValue.builder().s(domain.startTime()).build());
	    expressionAttributeValues.put(":endTime", AttributeValue.builder().s(domain.endTime()).build());
	    expressionAttributeValues.put(":workplace", AttributeValue.builder().s(domain.workplace()).build());

	    UpdateItemRequest updateRequest = UpdateItemRequest.builder()
	        .tableName(tableName)
	        .key(key)
	        .updateExpression("SET #st = :startTime, #et = :endTime, #wp = :workplace, #userId = userId, #dt = date")
	        .expressionAttributeNames(expressionAttributeNames)
	        .expressionAttributeValues(expressionAttributeValues)
	        .build();

	    try {
	        dynamoDbClient.updateItem(updateRequest);
	    }
	    catch (DynamoDbException e) {
        	throw new RuntimeException("DynamoDB putItem failed", e);
        } 
	}
    
    /**
     * 勤怠情報を1件取得（PK+SKでユニーク）
     * 返り値は既存互換のため List<AttendanceResponse> としている
     */
    public Optional<AttendanceDomain> findByUserIdAndDate(String userId, String date) throws DynamoDbException{
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
            	return Optional.empty();
            }
            return Optional.of(mapToAttendanceDomain(item));

        } catch (DynamoDbException e) {
            throw new RuntimeException("DynamoDB getDiary failed", e);
        }
    }
    
    /**
     * ユーザIDに紐づく勤怠情報を全件取得する
     */
	public List<AttendanceDomain> findAllByUserId(String userId) {
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
	                .map(this::mapToAttendanceDomain)
	                .collect(Collectors.toList());
	    }
	    catch (DynamoDbException e) {
	        throw new RuntimeException("DynamoDB queryTaskList failed", e);
	    }
	}
    
	/**
	 * DynamoDB 1アイテム → AttendanceDomain 変換
	 */
	private AttendanceDomain mapToAttendanceDomain(Map<String, AttributeValue> item) {
	    return new AttendanceDomain(
	    		item.get(ATTR_USER_ID).s(),
	    		item.get(ATTR_DATE).s(),
	    		item.get(ATTR_START_TIME).s(),
	    		item.get(ATTR_END_TIME).s(),
	    		item.get(ATTR_WORKPLACE).s()
	    		);
	}
}
