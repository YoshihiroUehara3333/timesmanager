package com.slack_timesmanager.enums;

public enum DynamoPK {
	DIARY("/DAILYREPORT"),
	TASK("/TASK"),
	ATTENDANCE("/ATTENDANCE"),
	THREAD("/THREAD");
	
	private String suffix;
	
	// コンストラクタ
    private DynamoPK(String suffix) {
        this.suffix = suffix;
    }
    
    public String getPartitionKey(String userId) {
    	return userId + this.suffix;
    }
}
