package com.timesmanager.api.feature.attendance.dto;

import com.timesmanager.api.common.core.Response;
import com.timesmanager.api.feature.attendance.domain.Attendance;

import lombok.Getter;

@Getter
public class AttendanceResponse implements Response{
	private String userId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
	
	public AttendanceResponse(
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
	
	public static AttendanceResponse fromDomain(Attendance domain) {
		return new AttendanceResponse(
				domain.getUserId(),
				domain.getDate(),
				domain.getStartTime(),
				domain.getEndTime(),
				domain.getWorkplace()
				);
	}
	
}
