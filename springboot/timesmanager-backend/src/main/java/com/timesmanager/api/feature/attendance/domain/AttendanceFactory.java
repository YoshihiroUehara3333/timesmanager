package com.timesmanager.api.feature.attendance.domain;

import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;

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
}
