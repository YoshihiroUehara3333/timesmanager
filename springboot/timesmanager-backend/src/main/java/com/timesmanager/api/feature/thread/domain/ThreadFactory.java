package com.timesmanager.api.feature.thread.domain;

import java.util.Map;

import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.feature.thread.dto.ThreadCreateRequest;

import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public class ThreadFactory {

	public static Thread from (ThreadCreateRequest request) {
		return Thread.builder()
				.userId(request.getUserId())
				.channelId(request.getChannelId())
				.date(request.getDate())
				.threadTs(request.getThreadTs())
				.permalink(request.getPermalink())
				.build();
	}
	
	public static Thread from (Map<String, AttributeValue> item) {
		return Thread.builder()
				.channelId(item.get(DynamoAttrName.CHANNEL_ID.getValue()).s())
				.date(item.get(DynamoAttrName.DATE.getValue()).s())
				.userId(item.get(DynamoAttrName.USER_ID.getValue()).s())
				.threadTs(item.get(DynamoAttrName.THREAD_TS.getValue()).s())
				.permalink(item.get(DynamoAttrName.PERMALINK.getValue()).s())
				.build();
	}
}
