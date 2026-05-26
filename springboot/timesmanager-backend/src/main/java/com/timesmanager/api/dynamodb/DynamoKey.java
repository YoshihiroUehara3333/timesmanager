package com.timesmanager.api.dynamodb;

/**
 * DynamoDB の PK/SK を一つにまとめた値オブジェクト
 */
public class DynamoKey {

    private final String partitionKey;
    private final String sortKey;

    public DynamoKey(String partitionKey, String sortKey) {
        this.partitionKey = partitionKey;
        this.sortKey = sortKey;
    }

    public String getPartitionKey() {
        return partitionKey;
    }

    public String getSortKey() {
        return sortKey;
    }
}