package com.timesmanager.api.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timesmanager.api.feature.task.TaskService;
import com.timesmanager.api.feature.task.dto.TaskRequest;
import com.timesmanager.api.feature.task.dto.TaskResponse;

@RestController
@RequestMapping("/api/task")
public class TaskController {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(TaskController.class);
	
	private final TaskService taskService;
	
	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}
	
	
	/**
	 * タスク新規入力
	 * @param request
	 * @return 正常終了: 200 OK
	 */
	@PostMapping
	public ResponseEntity<TaskResponse> post(
			@Valid @RequestBody TaskRequest request
	){
		log.info("Received POST /api/task: {}", request);
		
		TaskResponse response = taskService.create(request);
		return ResponseEntity.ok(response);
	}

	/**
	 * タスク全件取得
	 * @param userId
	 * @return データ1件以上: 200 OK データ0件: 204 No Content
	 */
	@GetMapping
	public ResponseEntity<List<TaskResponse>> getAll(
			@RequestParam(required = true) String userId
    ){
		log.info("📥 GET /api/task called. userId={}", userId);

		List<TaskResponse> response = taskService.getAllByUserId(userId);
		if (response.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		}
		return ResponseEntity.ok(response);
	}
}
