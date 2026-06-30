package com.timesmanager.api.feature.attendance.domain;

import com.timesmanager.api.common.core.Domain;

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
}
