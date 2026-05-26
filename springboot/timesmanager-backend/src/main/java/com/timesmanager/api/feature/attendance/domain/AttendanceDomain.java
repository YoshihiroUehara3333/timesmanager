package com.timesmanager.api.feature.attendance.domain;

import com.timesmanager.api.common.core.Domain;
import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;

public class AttendanceDomain implements Domain {
	final String userId;
	final String date;
	final String startTime;
	final String endTime;
	final String workplace;
	
	public AttendanceDomain (
		String userId,
		String date,
		String startTime,
		String endTime,
		String workplace
	) {
		this.userId = userId;
		this.date = date;
		this.startTime = startTime;
		this.endTime = endTime;
		this.workplace = workplace;
	}
	
	public AttendanceDomain (AttendanceRequest request) {
		this.userId = request.getUserId();
		this.date = request.getDate();
		this.startTime = request.getStartTime();
		this.endTime = request.getEndTime();
		this.workplace = request.getWorkplace();
	}
	
	public static AttendanceDomain createFromRequest (AttendanceRequest request) {
		if (request.getStartTime() != null && request.getEndTime() != null) {
			throw new RuntimeException();
		}
		
		return new AttendanceDomain (request);
	}
}
