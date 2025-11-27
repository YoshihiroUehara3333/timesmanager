package com.slack_timesmanager.attendance;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.slack_timesmanager.enums.DynamoPK;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

@Repository
public class AttendanceDynamoRepository {

    // ===== 属性名の定数 =====
    private static final String ATTR_PK         = "partition_key";
    private static final String ATTR_SK         = "sort_key";
    private static final String ATTR_USER_ID    = "userId";
    private static final String ATTR_DATE       = "date";
    private static final String ATTR_START_TIME  = "start_time";
    private static final String ATTR_END_TIME    = "end_time";
    private static final String ATTR_WORKPLACE  = "work_place";
	
    private final String tableName;
	private final DynamoDbClient dynamoDbClient;
	
	public AttendanceDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		this.dynamoDbClient = dynamoDbClient;
		this.tableName = tableName;
	}
	
    /**
     * 勤怠情報を保存
     */
    public boolean putItem(AttendanceRequest request) throws Exception {
		String partitionKey = DynamoPK.ATTENDANCE.getPartitionKey(request.getUserId());
        String sortKey = request.getDate();

        Map<String, AttributeValue> item = new HashMap<>();
        item.put(ATTR_PK, AttributeValue.builder().s(partitionKey).build());
        item.put(ATTR_SK, AttributeValue.builder().s(sortKey).build());
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
            throw new Exception("DynamoDB putItem failed", e);
        }
    }
    
    /**
     * 勤怠情報を1件取得（PK+SKでユニーク）
     * 返り値は既存互換のため List<AttendanceResponse> としている
     */
    public List<AttendanceResponse> getAttendance(String userId, String date) throws DynamoDbException{
        String partitionKey = DynamoPK.ATTENDANCE.getPartitionKey(userId);
        String sortKey = date;

        Map<String, AttributeValue> key = new HashMap<>();
        key.put(ATTR_PK, AttributeValue.builder().s(partitionKey).build());
        key.put(ATTR_SK, AttributeValue.builder().s(sortKey).build());

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
