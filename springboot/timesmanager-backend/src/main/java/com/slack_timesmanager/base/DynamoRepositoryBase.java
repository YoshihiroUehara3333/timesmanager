package com.slack_timesmanager.base;

import org.springframework.beans.factory.annotation.Value;

import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

public class DynamoRepositoryBase {
    // ===== 属性名の定数 =====
    protected static final String ATTR_PK         = "partitionKey";
    protected static final String ATTR_SK         = "sortKey";
    
    protected final String tableName;
	protected final DynamoDbClient dynamoDbClient;
	
	public DynamoRepositoryBase(
			DynamoDbClient dynamoDbClient,
			@Value("${aws.dynamodb.tableName}") String tableName
	) {
		this.dynamoDbClient = dynamoDbClient;
		this.tableName = tableName;
	}
}
