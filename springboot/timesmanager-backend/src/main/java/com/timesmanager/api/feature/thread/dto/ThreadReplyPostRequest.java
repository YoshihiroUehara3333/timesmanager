package com.timesmanager.api.feature.thread.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import com.timesmanager.api.common.core.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ThreadReplyPostRequest implements Request {
	@NotBlank(message = "channelId は 必須です")
	private String channelId;
	
	@NotBlank(message = "date は 必須です")
    @Pattern(
        regexp = "\\d{4}-\\d{2}-\\d{2}",
        message = "date は yyyy-MM-dd 形式で入力してください（例: 2025-12-03）"
    )
	private String date;
	
	@NotBlank(message = "userId は 必須です")
	private String userId;
	
	@NotBlank(message = "parentTs は 必須です")
	private String parentTs;
	
	@NotBlank(message = "replyTs は 必須です")
    private String replyTs;
	
	@NotBlank(message = "text は 必須です")
	private String text;
}
