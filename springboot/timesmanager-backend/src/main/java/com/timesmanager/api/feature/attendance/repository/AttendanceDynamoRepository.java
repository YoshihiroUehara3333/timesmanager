package com.timesmanager.api.feature.attendance.repository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.timesmanager.api.common.dynamodb.AbstractDynamoRepository;
import com.timesmanager.api.common.dynamodb.DynamoDbAttributeValueMapBuilder;
import com.timesmanager.api.common.dynamodb.DynamoKey;
import com.timesmanager.api.common.dynamodb.DynamoKeyFactory;
import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.feature.attendance.domain.Attendance;
import com.timesmanager.api.feature.attendance.domain.AttendanceFactory;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

@org.springframework.stereotype.Repository
public class AttendanceDynamoRepository 
        extends AbstractDynamoRepository
        implements AttendanceRepository{

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
	public void save(Attendance domain) {
		DynamoKey itemKey = DynamoKeyFactory.attendanceItemKey(
                domain.getUserId(),
                domain.getDate()
        );
	    
        Map<String, AttributeValue> key = Map.of(
        		DynamoAttrName.PK.getValue(), buildAttrVal(itemKey.getPartitionKey())
        		,DynamoAttrName.SK.getValue(), buildAttrVal(itemKey.getSortKey())
        		);

	    Map<String, String> expressionAttributeNames = Map.of(
	    		"#userId", DynamoAttrName.USER_ID.getValue()
	    		,"#dt", ATTR_DATE
	    		,"#st", ATTR_START_TIME
	    		,"#et", ATTR_END_TIME
	    		,"#wp", ATTR_WORKPLACE
	    		);

	    Map<String, AttributeValue> expressionAttributeValues 
	    	= new DynamoDbAttributeValueMapBuilder()
	                    .putString(":date", domain.getDate())
	                    .putString(":userId", domain.getUserId())
	                    .putString(":startTime", domain.getStartTime())
	                    .putString(":endTime", domain.getEndTime())
	                    .putString(":workplace", domain.getWorkplace())
	                    .build();

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
        	throw e;
        } 
	}
    
    /**
     * 勤怠情報を1件取得（PK+SKでユニーク）
     * 返り値は既存互換のため List<AttendanceResponse> としている
     */
    public Optional<Attendance> findByUserIdAndDate(String userId, String date) throws DynamoDbException{
    	DynamoKey itemKey = DynamoKeyFactory.attendanceItemKey(
                userId,
                date
        );

        Map<String, AttributeValue> key = Map.of(
        		DynamoAttrName.PK.getValue(), buildAttrVal(itemKey.getPartitionKey())
        		,DynamoAttrName.SK.getValue(), buildAttrVal(itemKey.getSortKey())
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
            return Optional.of(AttendanceFactory.from(item));

        } catch (DynamoDbException e) {
            throw e;
        }
    }
    
    /**
     * ユーザIDに紐づく勤怠情報を全件取得する
     */
	public List<Attendance> findAllByUserId(String userId) {
		String partitionKey = DynamoKeyFactory.attendancePartitionKey(userId);

	    Map<String, AttributeValue> eav = Map.of(
	            ":pk", AttributeValue.builder().s(partitionKey).build()
	    );

	    QueryRequest queryRequest = QueryRequest.builder()
	            .tableName(tableName)
	            .keyConditionExpression(DynamoAttrName.PK.getValue() + "= :pk")
	            .expressionAttributeValues(eav)
	            .build();

	    try {
	        QueryResponse response = dynamoDbClient.query(queryRequest);

	        if (response.items() == null || response.items().isEmpty()) {
	            // 「レコード0件」の時は null ではなく空Listを返す
	            return Collections.emptyList();
	        }

	        return response.items().stream()
	                .map(AttendanceFactory::from)
	                .collect(Collectors.toList());
	    }
	    catch (DynamoDbException e) {
	        throw e;
	    }
	}	

}
