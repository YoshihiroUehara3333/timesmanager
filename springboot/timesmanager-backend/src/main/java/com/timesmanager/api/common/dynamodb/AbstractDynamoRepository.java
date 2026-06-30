package com.timesmanager.api.common.dynamodb;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public abstract class AbstractDynamoRepository {
    
    protected final String tableName;
	protected final DynamoDbClient dynamoDbClient;
	
	public AbstractDynamoRepository(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		this.dynamoDbClient = dynamoDbClient;
		this.tableName = tableName;
	}
	
	public static AttributeValue buildAttrVal(String str) {
		return AttributeValue.builder().s(str).build();
	}
	
	public static String getString(Map<String, AttributeValue> item, String key) {
	    AttributeValue v = item.get(key);
	    return (v == null || v.s() == null) ? "" : v.s();
	}
}
