package com.slack_timesmanager.diary;

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
	@PostMapping
	public ResponseEntity<Void> createDiary(@RequestBody DiaryRequest request){
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/{diaryId}")
	public ResponseEntity<Void> getDiary(@PathVariable String diaryId){
		return ResponseEntity.ok().build();
	}
}
