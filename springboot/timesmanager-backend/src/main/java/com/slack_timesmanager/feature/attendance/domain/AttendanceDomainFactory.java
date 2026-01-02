package com.slack_timesmanager.feature.attendance.domain;

import com.slack_timesmanager.feature.attendance.dto.AttendanceRequest;

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
