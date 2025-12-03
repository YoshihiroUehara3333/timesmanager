package com.slack_timesmanager.feature.thread;

import java.util.List;

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
     * スレッド登録
     * 
     * @param request スレッド登録リクエスト
     * @return 新規作成: 201 Created, 既存あり: 409 Conflict
     */
	@PostMapping
	public ResponseEntity<Void> post(
			@RequestBody ThreadRequest request
	){
		log.info("📥 Received POST /api/thread: {}", request);
		
		boolean created = threadService.save(request);
		if(created) {
			return ResponseEntity.status(HttpStatus.CREATED).build();
		} else {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
	}
	
    /**
     * スレッド取得
     * userId のみ指定 → ユーザに紐づくスレッド全件
     * userId + date 指定 → 該当日付のスレッド
     *
     * @param userId ユーザID（必須）
     * @param date   日付（任意）
     */
	@GetMapping
	public ResponseEntity<List<ThreadResponse>> get(
			@RequestParam(required = false) String userId,
	        @RequestParam(required = false) String date
	){	
		log.info("📥 Received GET /api/thread: userId={}, date={}", userId, date);
		
		List<ThreadResponse> responseBody = null;
		
		if (date == null) {
			responseBody = threadService.getAllByUserId(userId);
		} else {
			responseBody = threadService.getByUserIdAndDate(userId, date);
        }
		
		return ResponseEntity.ok(responseBody);
	}

}
