package com.slack_timesmanager.feature.thread;

import java.util.List;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.slack_timesmanager.feature.thread.dto.ThreadRequest;
import com.slack_timesmanager.feature.thread.dto.ThreadResponse;

@RestController
@RequestMapping("/api/thread")
public class ThreadController {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(ThreadController.class);
	
	private final ThreadService threadService;

	public ThreadController(ThreadService threadService) {
		this.threadService = threadService;
	}

    /**
     * スレッド新規作成
     * 
     * @param request スレッド新規作成リクエスト
     * @return 新規作成: 201 Created, 既存あり: 409 Conflict
     */
	@PostMapping
	public ResponseEntity<ThreadResponse> post(
			@Valid @RequestBody ThreadRequest request		
	){
		log.info("📥 Received POST /api/thread: userId = {}, date = {}", request.getUserId(), request.getDate());
		
		ThreadResponse res = threadService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(res);
	}
	
    /**
     * スレッド1件取得
     *
     * @param userId ユーザID
     * @param date   日付
     * @return データ有: 200 OK データ無: 204 No Content
     */
	@GetMapping("/{date}/")
	public ResponseEntity<ThreadResponse> getByDate(
			@PathVariable String date,
			@RequestParam String userId
	){	
		log.info("📥 Received GET /api/thread/" + date + ": userId={}", userId);
		
		return threadService.getByUserIdAndDate(userId, date)
				.map((response) -> ResponseEntity.ok(response))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.NO_CONTENT).build());
	}
	
    /**
     * スレッド全件取得
     *
     * @param userId ユーザID
     * @return データ有: 200 OK データ無: 204 No Content
     */
	@GetMapping
	public ResponseEntity<List<ThreadResponse>> getAllByUserId(
			@RequestParam String userId
	){	
		log.info("📥 Received GET /api/thread: userId={}", userId);
		
		List<ThreadResponse> threads = threadService.getAllByUserId(userId);
		return ResponseEntity.ok(threads);
	}
}
