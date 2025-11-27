package com.slack_timesmanager.thread;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.slack_timesmanager.common.ServiceResult;

@RestController
@RequestMapping("/api/thread")
public class ThreadController {
	private static final Logger log = LoggerFactory.getLogger(ThreadController.class);
	
	private final ThreadService threadService;

	public ThreadController(ThreadService threadService) {
		super();
		this.threadService = threadService;
	}

	@PostMapping
	public ResponseEntity<Void> post(
			@RequestBody ThreadRequest request
	){
		log.info("📥 Received POST /api/thread: {}", request);
		
		ServiceResult<Void> result = threadService.save(request);
		
		if(result.isSuccess()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
	
	@GetMapping
	public ResponseEntity<List<ThreadResponse>> get(
			@RequestParam(required = true) String channelId,
	        @RequestParam(required = false) String date
	){	
		log.info("📥 Received GET /api/thread: {}", channelId, date);
		
		ServiceResult<List<ThreadResponse>> result;
		
		if (date == null) {
			result = threadService.getAllByChannelId(channelId);
		} else {
			result = threadService.getByChannelIdAndDate(channelId, date);
        }
		
		if(result.isSuccess()) {
			return ResponseEntity.ok(result.getBody());
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
}
