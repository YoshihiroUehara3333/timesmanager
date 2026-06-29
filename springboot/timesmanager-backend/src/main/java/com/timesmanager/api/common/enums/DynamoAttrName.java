package com.timesmanager.api.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DynamoAttrName {
	
	PK("partition_key"),
	SK("sort_key"),
	
	USER_ID("user_id"),
    CHANNEL_ID("channel_id"),
	
    DATE("date"),
    PERMALINK("permalink"),
    THREAD_TS("thread_ts");
    
	
	private final String value;
}
