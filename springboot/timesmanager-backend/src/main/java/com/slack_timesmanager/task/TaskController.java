package com.slack_timesmanager.task;

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
@RequestMapping("/api/task")
public class TaskController {
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
		
		ServiceResult<Void> result = taskService.save(request);
		
		if(result.isSuccess()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}

	@GetMapping
	public ResponseEntity<List<TaskResponse>> get(
			@RequestParam(required = true) String userId,
	        @RequestParam(required = false) String date
    ){
		log.info("📥 GET /api/task called. userId={}, date={}", userId, date);
		
		ServiceResult<List<TaskResponse>> result;
		
		if (date == null) {
			result = taskService.getAllByUserId(userId);
		} else {
			result = taskService.getByUserIdAndDate(userId, date);
        }
		
		if(result.isSuccess()) {
			return ResponseEntity.ok(result.getBody());
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
	
	@GetMapping("/serial")
    public ResponseEntity<TaskSerialResponse> getSerial(
            @RequestParam String userId,
            @RequestParam String date
    ) {
        log.info("📥 GET /api/task/serial: userId={}, date={}", userId, date);

        ServiceResult<TaskSerialResponse> result = taskService.issueSerial(userId, date);

        if (!result.isSuccess()) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(result.getBody());
    }
}
