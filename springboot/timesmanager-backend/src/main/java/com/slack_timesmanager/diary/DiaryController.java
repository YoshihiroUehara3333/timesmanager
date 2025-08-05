package com.slack_timesmanager.diary;

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
@RequestMapping("/api/diary")
public class DiaryController {
	private static final Logger log = LoggerFactory.getLogger(DiaryController.class);
	
	private final DiaryService diaryService;
	
	public DiaryController(DiaryService diaryService) {
	    this.diaryService = diaryService;
	}
	
	@PostMapping
	public ResponseEntity<Void> createDiary(@RequestBody DiaryRequest request){
		
		log.info("📥 Received POST /api/diary: {}", request);
		ServiceResult result = diaryService.save(request);
		if(result.getStatus()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
	
	@GetMapping("/{userId}/{date}")
	public ResponseEntity<DiaryResponse> getDiary(
			@PathVariable String userId,
			@PathVariable String date){
		
		log.info("📥 Received GET /api/diary: {}", userId, date);
		ServiceResult result = diaryService.getDiary(userId, date);
		if(result.getStatus()) {
			DiaryResponse response = (DiaryResponse)result.getResponse();
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}
