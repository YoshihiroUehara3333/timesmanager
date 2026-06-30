package com.timesmanager.api.feature.thread.dto;

import com.timesmanager.api.common.core.Response;
import com.timesmanager.api.feature.thread.domain.ThreadReply;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ThreadReplyResponse implements Response {
	private final String channelId;
	private final String date;
	private final String userId;
	private final String parentTs;
	private final String replyTs;
	private final String text;
    
	public static ThreadReplyResponse from(ThreadReply domain) {
		return new ThreadReplyResponse(
				domain.getChannelId(),
				domain.getDate(),
				domain.getUserId(),
				domain.getParentTs(),
				domain.getText(),
				domain.getUserId()
				);
	}
}
