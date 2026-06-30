package com.timesmanager.api.feature.thread.dto;


import com.timesmanager.api.common.core.dto.Response;
import com.timesmanager.api.feature.thread.domain.Thread;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ThreadResponse implements Response{
	private final String channelId;
	private final String date;
	private final String userId;
    private final String threadTs;
    private final String permalink;
	
	public static ThreadResponse from(Thread domain) {
		return new ThreadResponse(
				domain.getChannelId(),
				domain.getDate(),
				domain.getUserId(),
				domain.getThreadTs(),
				domain.getPermalink()
				);
	}
}
