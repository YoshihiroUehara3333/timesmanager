package com.timesmanager.api.feature.attendance.dto;

import com.slack_timesmanager.common.core.Response;
import com.timesmanager.api.feature.attendance.domain.AttendanceDomain;

import lombok.Getter;

@Getter
public class AttendanceResponse implements Response{

	
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
	
	public static AttendanceResponse fromDomain(AttendanceDomain domain) {
		return new AttendanceResponse(
				domain.userId(),
				domain.date(),
				domain.startTime(),
				domain.endTime(),
				domain.workplace()
				);
	}
	
	private String userId;
	private String date;
	private String startTime;
	private String endTime;
	private String workplace;
}
