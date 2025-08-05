package com.slack_timesmanager.thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	public ResponseEntity<Void> post(@RequestBody ThreadRequest request){
		
		log.info("📥 Received POST /api/diary: {}", request);
		ServiceResult result = threadService.save(request);
		if(result.getStatus()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
	
	@GetMapping("/{userId}/{date}")
	public ResponseEntity<ThreadResponse> get(
			@PathVariable String userId,
			@PathVariable String date){
		
		log.info("📥 Received GET /api/diary: {}", userId, date);
		ServiceResult result = threadService.getThread(userId, date);
		if(result.getStatus()) {
			ThreadResponse response = (ThreadResponse)result.getResponse();
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}
