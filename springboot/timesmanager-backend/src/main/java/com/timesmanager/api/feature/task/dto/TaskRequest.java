package com.timesmanager.api.feature.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import com.slack_timesmanager.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest implements Request {
	
	@NotBlank(message = "userId は 必須です")
	private String userId;
	
	private String serial;
	
	@NotBlank(message = "date は 必須です")
    @Pattern(
        regexp = "\\d{4}-\\d{2}-\\d{2}",
        message = "date は yyyy-MM-dd 形式で入力してください（例: 2025-12-03）"
    )
	private String date;
	
	@NotBlank(message = "taskName は 必須です")
	private String taskName;
	
	private String memo;
	
	public TaskRequest() {
	}
}
