package com.slack_timesmanager.feature.thread.domain;

import com.slack_timesmanager.common.core.Domain;

public record ThreadDomain (
		String channelId,
		String date,
		String userId,
		String threadTs,
		String permalink
	) implements Domain {
	
}
