package com.timesmanager.api.feature.attendance.domain;

import com.timesmanager.api.common.core.Domain;
import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Attendance implements Domain {
	private String userId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
	
	public Attendance (
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
	
	public Attendance (AttendanceRequest request) {
		this.userId = request.getUserId();
		this.date = request.getDate();
		this.startTime = request.getStartTime();
		this.endTime = request.getEndTime();
		this.workplace = request.getWorkplace();
	}
	
	public static Attendance createFromRequest (AttendanceRequest request) {
		if (request.getStartTime() != null && request.getEndTime() != null) {
			throw new RuntimeException();
		}
		
		return new Attendance (request);
	}
}
