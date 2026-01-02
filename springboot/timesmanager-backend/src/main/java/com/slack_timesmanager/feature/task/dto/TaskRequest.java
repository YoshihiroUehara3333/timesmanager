package com.slack_timesmanager.feature.task.dto;

import jakarta.validation.constraints.NotBlank;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest implements Request{
	
	@NotBlank(message = "userId は 必須です")
	private String userId;
	
	@NotBlank(message = "channelId は 必須です")
	private String channelId;
	
	private String date;
	private String taskName;
	private String targetTime;
	private String memo;
	private String status;
	private String serial;
	private String threadTs;
	
	public TaskRequest() {
	}
}
