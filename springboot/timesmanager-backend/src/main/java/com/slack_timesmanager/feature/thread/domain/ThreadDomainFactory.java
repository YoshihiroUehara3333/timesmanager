package com.slack_timesmanager.feature.thread.domain;

import com.slack_timesmanager.feature.thread.dto.ThreadRequest;

public class ThreadDomainFactory {
	
	public static ThreadDomain fromThreadRequest (ThreadRequest request) {
		return new ThreadDomain(
        		request.getChannelId(),
        		request.getDate(),
        		request.getUserId(),
        		request.getThreadTs(),
        		request.getPermalink());
	}
}
