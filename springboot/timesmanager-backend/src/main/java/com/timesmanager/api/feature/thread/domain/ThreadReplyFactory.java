package com.timesmanager.api.feature.thread.domain;

import com.timesmanager.api.common.core.DomainModelFactory;
import com.timesmanager.api.feature.thread.dto.ThreadReplyPostRequest;

public class ThreadReplyFactory implements DomainModelFactory<ThreadReply>{
	
	public static ThreadReply from(ThreadReplyPostRequest request) {
		return ThreadReply.builder()
				.userId(request.getUserId())
				.channelId(request.getChannelId())
				.date(request.getDate())
				.parentTs(request.getParentTs())
				.replyTs(request.getReplyTs())
				.text(request.getText())
				.build();
	}
}
