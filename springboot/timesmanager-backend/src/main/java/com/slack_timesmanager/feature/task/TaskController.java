package com.slack_timesmanager.feature.task;

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

@RestController
@RequestMapping("/api/task")
public class TaskController {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(TaskController.class);
	
	private final TaskService taskService;
	
	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}
	
	
	@PostMapping
	public ResponseEntity<Void> post(
			@RequestBody TaskRequest request
	){
		log.info("📥 Received POST /api/task: {}", request);
		
		taskService.save(request);
		return ResponseEntity.ok().build();
	}

	@GetMapping
	public ResponseEntity<List<TaskResponse>> get(
			@RequestParam(required = true) String userId,
	        @RequestParam(required = false) String date
    ){
		log.info("📥 GET /api/task called. userId={}, date={}", userId, date);
		
		List<TaskResponse> responseBody = null;
		
		if (date == null || date.isBlank()) {
			responseBody = taskService.getAllByUserId(userId);
		} else {
			responseBody = taskService.getByUserIdAndDate(userId, date);
        }
		return ResponseEntity.ok(responseBody);
	}
	
	@GetMapping("/serial")
    public ResponseEntity<TaskSerialResponse> getSerial(
            @RequestParam String userId,
            @RequestParam String date
    ) {
        log.info("📥 GET /api/task/serial: userId={}, date={}", userId, date);

        TaskSerialResponse responseBody = taskService.issueSerial(userId, date);
        return ResponseEntity.ok(responseBody);
    }
}
