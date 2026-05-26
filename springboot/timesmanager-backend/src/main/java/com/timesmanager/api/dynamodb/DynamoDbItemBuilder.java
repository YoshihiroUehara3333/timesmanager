package com.timesmanager.api.dynamodb;

import java.util.HashMap;
import java.util.Map;

import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public class DynamoDbItemBuilder {

    private final Map<String, AttributeValue> map = new HashMap<>();

    public DynamoDbItemBuilder putString(String key, String value) {
        map.put(key, AttributeValue.builder().s(value).build());
        return this;
    }

    public DynamoDbItemBuilder putNumber(String key, Number value) {
        map.put(key, AttributeValue.builder().n(String.valueOf(value)).build());
        return this;
    }

    public DynamoDbItemBuilder putBoolean(String key, boolean value) {
        map.put(key, AttributeValue.builder().bool(value).build());
        return this;
    }

    public Map<String, AttributeValue> build() {
        return map;
    }
}