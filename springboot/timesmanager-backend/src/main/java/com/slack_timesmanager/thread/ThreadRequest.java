package com.slack_timesmanager.thread;

import com.slack_timesmanager.core.Request;

public class ThreadRequest implements Request{
	private String channelId;
	private String date;
	private String userId;
    private String threadTs;
    private String permalink;
    
	public String getChannelId() {
		return channelId;
	}
	public void setChannelId(String channelId) {
		this.channelId = channelId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getThreadTs() {
		return threadTs;
	}
	public void setThreadTs(String threadTs) {
		this.threadTs = threadTs;
	}
	public String getPermalink() {
		return permalink;
	}
	public void setPermalink(String permalink) {
		this.permalink = permalink;
	}
}
