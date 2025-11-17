package com.slack_timesmanager.task;

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

	@GetMapping
	public ResponseEntity<TaskResponse> get(
			@RequestParam(required = false) String userId,
	        @RequestParam(required = false) String date
    ){
		log.info("📥 GET /api/task called. userId={}, date={}", userId, date);
		
		ServiceResult result;
		
		if (userId == null && date == null) {
			result = taskService.getAll();
			
		} else if (userId != null && date == null) {
			result = taskService.getAllByUserId(userId);
			
		} else if (userId != null && date != null){
			result = taskService.getByUserIdAndDate(userId, date);
			
		} else {
            return ResponseEntity.badRequest().build();
        }
		
		if(result.getStatus()) {
			TaskResponse response = (TaskResponse)result.getResponse();
			return ResponseEntity.ok(response);
			
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@PostMapping
	public ResponseEntity<Void> post(
			@RequestBody TaskRequest request)
	{
		log.info("📥 Received POST /api/task: {}", request);
		
		ServiceResult result = taskService.save(request);
		if(result.getStatus()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
}
