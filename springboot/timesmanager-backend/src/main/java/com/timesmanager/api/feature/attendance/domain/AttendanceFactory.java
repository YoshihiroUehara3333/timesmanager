package com.timesmanager.api.feature.attendance.domain;

import java.util.Map;

import com.timesmanager.api.common.enums.DynamoAttrName;
import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;

import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

public class AttendanceFactory {
	
	public static Attendance from (AttendanceRequest request) {
		return Attendance.builder()
				.userId(request.getUserId())
				.date(request.getDate())
				.startTime(request.getStartTime())
				.endTime(request.getEndTime())
				.workplace(request.getWorkplace())
				.build();
	}
	
	public static Attendance from (Map<String, AttributeValue> item) {
		return Attendance.builder()
				.userId( getString(item, DynamoAttrName.USER_ID.getValue()) )
				.date( getString(item, DynamoAttrName.USER_ID.getValue()) ) 
				.startTime( getString(item, DynamoAttrName.USER_ID.getValue()) )
				.endTime( getString(item, DynamoAttrName.USER_ID.getValue()) )
				.workplace( getString(item, DynamoAttrName.USER_ID.getValue()) )
				.build();
	}
	
	public static String getString(Map<String, AttributeValue> item, String key) {
	    AttributeValue v = item.get(key);
	    return (v == null || v.s() == null) ? "" : v.s();
	}
}
