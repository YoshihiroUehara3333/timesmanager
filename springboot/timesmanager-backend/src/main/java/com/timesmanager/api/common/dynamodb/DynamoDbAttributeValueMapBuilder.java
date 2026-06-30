package com.timesmanager.api.common.dynamodb;

import java.util.HashMap;
import java.util.Map;

import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public class DynamoDbAttributeValueMapBuilder {

    private final Map<String, AttributeValue> map = new HashMap<>();

    public DynamoDbAttributeValueMapBuilder putString(String key, String value) {
        map.put(key, AttributeValue.builder().s(value).build());
        return this;
    }

    public DynamoDbAttributeValueMapBuilder putNumber(String key, Number value) {
        map.put(key, AttributeValue.builder().n(String.valueOf(value)).build());
        return this;
    }

    public DynamoDbAttributeValueMapBuilder putBoolean(String key, boolean value) {
        map.put(key, AttributeValue.builder().bool(value).build());
        return this;
    }

    public Map<String, AttributeValue> build() {
        return map;
    }
}