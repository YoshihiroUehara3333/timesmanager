package com.timesmanager.api.controller;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.timesmanager.api.feature.thread.ThreadReplyService;
import com.timesmanager.api.feature.thread.dto.ThreadReplyPostRequest;
import com.timesmanager.api.feature.thread.dto.ThreadReplyResponse;

@RestController
@RequestMapping("/api/thread/reply")
public class ThreadReplyController {

	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(ThreadController.class);
	
	private final ThreadReplyService threadReplyService;

	public ThreadReplyController(ThreadReplyService threadReplyService) {
		this.threadReplyService = threadReplyService;
	}
	
    /**
     * スレッド返信保存
     * 
     * @param request スレッド新規作成リクエスト
     * @return 新規作成: 201 Created
     */
	@PostMapping
	public ResponseEntity<ThreadReplyResponse> post(
			@Valid @RequestBody ThreadReplyPostRequest request
	){
		log.info("Received POST /api/thread/reply: userId = {}, date = {}", request.getUserId(), request.getDate());
		
		ThreadReplyResponse res = threadReplyService.save(request);
		return ResponseEntity.ok(res);
	}
}
