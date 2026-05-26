package com.timesmanager.api.feature.attendance;

import java.util.Collections;
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
import com.timesmanager.api.feature.attendance.domain.AttendanceDomain;

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
	    
        Map<String, AttributeValue> key = Map.of(
        		ATTR_PK, buildAttributeValue(itemKey.getPartitionKey())
        		,ATTR_SK, buildAttributeValue(itemKey.getSortKey())
        		);

	    Map<String, String> expressionAttributeNames = Map.of(
	    		"#userId", ATTR_USER_ID
	    		,"#dt", ATTR_DATE
	    		,"#st", ATTR_START_TIME
	    		,"#et", ATTR_END_TIME
	    		,"#wp", ATTR_WORKPLACE
	    		);

	    Map<String, AttributeValue> expressionAttributeValues = Map.of(
	    		":date", buildAttributeValue(domain.date())
	    		,":userId", buildAttributeValue(domain.userId())
	    		,":startTime", buildAttributeValue(domain.startTime())
	    		,":endTime", buildAttributeValue(domain.endTime())
	    		,":workplace", buildAttributeValue(domain.workplace())
	    		);

	    UpdateItemRequest updateRequest = UpdateItemRequest.builder()
	        .tableName(tableName)
	        .key(key)
	        .updateExpression("SET #userId = :userId, #dt = :date, #st = :startTime, #et = :endTime, #wp = :workplace")
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

        Map<String, AttributeValue> key = Map.of(
        		ATTR_PK, buildAttributeValue(itemKey.getPartitionKey())
        		,ATTR_SK, buildAttributeValue(itemKey.getSortKey())
        		);

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
	    	    getString(item, ATTR_USER_ID),
	    	    getString(item, ATTR_DATE),
	    	    getString(item, ATTR_START_TIME),
	    	    getString(item, ATTR_END_TIME),
	    	    getString(item, ATTR_WORKPLACE)
	    		);
	}
	

}
