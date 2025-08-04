package com.slack_timesmanager.diary;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diary")
public class DiaryController {
	@PostMapping
	public ResponseEntity<Void> createThread(@RequestBody DiaryRequest request){
		return ResponseEntity.ok().build();
	}
}
