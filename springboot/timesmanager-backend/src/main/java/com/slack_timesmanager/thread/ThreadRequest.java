package com.slack_timesmanager.thread;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThreadRequest implements Request{
	private String channelId;
	private String date;
	private String userId;
    private String threadTs;
    private String permalink;
}
