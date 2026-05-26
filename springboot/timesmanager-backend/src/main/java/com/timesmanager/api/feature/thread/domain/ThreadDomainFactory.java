package com.timesmanager.api.feature.thread.domain;

import com.timesmanager.api.feature.thread.dto.ThreadCreateRequest;

public class ThreadDomainFactory {

	public static ThreadDomain fromCreateRequest(ThreadCreateRequest request) {
		return ThreadDomain.create(
        		request.getChannelId(),
        		request.getDate(),
        		request.getUserId(),
        		request.getThreadTs(),
        		request.getPermalink());
	}
}
