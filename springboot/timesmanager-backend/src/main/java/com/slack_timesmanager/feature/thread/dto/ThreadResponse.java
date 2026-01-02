package com.slack_timesmanager.feature.thread.dto;

import com.slack_timesmanager.common.core.Response;
import com.slack_timesmanager.feature.thread.domain.ThreadDomain;

import lombok.Getter;

@Getter
public class ThreadResponse implements Response{
	
	public ThreadResponse(
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
				domain.channelId(),
				domain.date(),
				domain.userId(),
				domain.threadTs(),
				domain.permalink()
				);
	}
	
	private final String channelId;
	private final String date;
	private final String userId;
    private final String threadTs;
    private final String permalink;
}
