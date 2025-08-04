package com.slack_timesmanager.diary;

public class DiaryResponse {
	private String userId;
	private String date;
	private String startTime;
    private String endTime;
    private String workplace;
    
	public DiaryResponse(String userId, String startTime, String endTime, String workplace) {
		super();
		this.userId = userId;
		this.startTime = startTime;
		this.endTime = endTime;
		this.workplace = workplace;
	}
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getWorkplace() {
		return workplace;
	}
	public void setWorkplace(String workplace) {
		this.workplace = workplace;
	}

}
