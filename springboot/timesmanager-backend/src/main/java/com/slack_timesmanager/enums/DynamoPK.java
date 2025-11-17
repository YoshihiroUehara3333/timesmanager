package com.slack_timesmanager.enums;

public enum DynamoPK {
	DAILYREPORT("/DAILYREPORT"),
	TASK("/TASK");
	
	private String suffix;
	
	// コンストラクタ
    private DynamoPK(String suffix) {
        this.suffix = suffix;
    }
    
    public String getPartitionKey(String userId) {
    	return userId + this.suffix;
    }
}
