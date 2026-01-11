package com.slack_timesmanager.feature.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequest implements Request{
	@NotBlank
	private String userId;
	
	@NotBlank
    @Pattern(
        regexp = "\\d{4}-\\d{2}-\\d{2}",
        message = "date は yyyy-MM-dd 形式で入力してください（例: 2025-12-03）"
    )
	private String date;
	
	@NotBlank
	private String startTime;
	
	@NotBlank
	private String endTime;
	
	@NotBlank
	private String workplace;
  
}
