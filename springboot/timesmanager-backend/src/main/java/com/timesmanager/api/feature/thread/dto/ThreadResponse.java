package com.timesmanager.api.feature.thread.dto;


import com.timesmanager.api.common.core.Response;
import com.timesmanager.api.feature.thread.domain.ThreadDomain;

import lombok.Getter;

@Getter
public class ThreadResponse implements Response{
	private final String channelId;
	private final String date;
	private final String userId;
    private final String threadTs;
    private final String permalink;
	
	private ThreadResponse(
			String channelId,
			String date,
			String userId,
			String threadTs,
			String permalink
	) {
		this.channelId = channelId;
		this.date = date;
		this.userId = userId;
		this.threadTs = threadTs;
		this.permalink = permalink;
	}
	
	public static ThreadResponse fromDomain(ThreadDomain domain) {
		return new ThreadResponse(
				domain.getChannelId(),
				domain.getDate(),
				domain.getUserId(),
				domain.getThreadTs(),
				domain.getPermalink()
				);
	}
}
