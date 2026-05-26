package com.timesmanager.api.feature.attendance.domain;

import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;

public class AttendanceDomainFactory {
	
	public static AttendanceDomain fromAttendanceRequest (AttendanceRequest request) {
		return new AttendanceDomain(
				request.getUserId(),
				request.getDate(),
				request.getStartTime(),
				request.getEndTime(),
				request.getWorkplace()
				);
	}
}
