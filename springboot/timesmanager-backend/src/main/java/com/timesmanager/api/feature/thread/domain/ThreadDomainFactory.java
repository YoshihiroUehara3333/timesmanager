package com.timesmanager.api.feature.thread.domain;

import com.timesmanager.api.feature.thread.dto.ThreadRequest;

public class ThreadDomainFactory {

	public static ThreadDomain fromRequest(ThreadRequest request) {
		return ThreadDomain.create(
        		request.getChannelId(),
        		request.getDate(),
        		request.getUserId(),
        		request.getThreadTs(),
        		request.getPermalink());
	}
}
