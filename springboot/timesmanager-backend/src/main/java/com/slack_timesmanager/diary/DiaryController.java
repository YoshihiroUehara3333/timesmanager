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

@RestController
@RequestMapping("/api/diary")
public class DiaryController {
	private static final Logger log = LoggerFactory.getLogger(DiaryController.class);
	
	DiaryService diaryService;
	
	public DiaryController(DiaryService diaryService) {
	    this.diaryService = diaryService;
	}
	
	@PostMapping
	public ResponseEntity<Void> createDiary(@RequestBody DiaryRequest request){
		log.info("📥 Received POST /api/diary: {}", request);
		return diaryService.save(request);
	}
	
	@GetMapping("/{userId}{date}")
	public DiaryResponse getDiary(
			@PathVariable String userId,
			@PathVariable String date){
		log.info("📥 Received GET /api/diary: {}", userId, date);
		
		DiaryResponse res = diaryService.getDiary(userId, date);
		if (res != null) {
			return res;
		} else {
			return null;
		}
	}
}
