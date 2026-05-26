package com.timesmanager.api.common.base;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public class DynamoRepositoryBase {
    // ===== 属性名の定数 =====
    protected static final String ATTR_PK         = "partition_key";
    protected static final String ATTR_SK         = "sort_key";
    protected static final String ATTR_USER_ID    = "user_id";
    protected static final String ATTR_CHANNEL_ID = "channel_id";
    protected static final String ATTR_DATE       = "date";
    
    protected final String tableName;
	protected final DynamoDbClient dynamoDbClient;
	
	public DynamoRepositoryBase(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		this.dynamoDbClient = dynamoDbClient;
		this.tableName = tableName;
	}
	
	public static AttributeValue buildAttributeValue(String str) {
		return AttributeValue.builder().s(str).build();
	}
	
	public static String getString(Map<String, AttributeValue> item, String key) {
	    AttributeValue v = item.get(key);
	    return (v == null || v.s() == null) ? "" : v.s();
	}
}
