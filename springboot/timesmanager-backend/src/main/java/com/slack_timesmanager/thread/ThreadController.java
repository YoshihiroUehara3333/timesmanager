package com.slack_timesmanager.thread;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/thread")
public class ThreadController {
	
	@Autowired
	private ThreadService threadService;
    
	@GetMapping("/{channelId}")
	public ThreadResponse getByChannelId(@PathVariable String channelId) {
		return null;
	}
	
	@PostMapping
	public ResponseEntity<Void> createThread(@RequestBody ThreadRequest request){
		threadService.save(request);
		return ResponseEntity.ok().build();
	}
}
