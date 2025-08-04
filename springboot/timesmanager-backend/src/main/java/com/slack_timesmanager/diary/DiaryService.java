package com.slack_timesmanager.diary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DiaryService {
	
	private static final Logger log = LoggerFactory.getLogger(DiaryController.class);
	
	private DiaryDynamoRepository diaryDynamoRepository;

	public DiaryService(DiaryDynamoRepository diaryDynamoDbRepository) {
		this.diaryDynamoRepository = diaryDynamoDbRepository;
	}

	public ResponseEntity<Void> save(DiaryRequest request) {
		try {
			diaryDynamoRepository.updateItem(request);
		}
		catch(Exception e) {
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.ok().build();
	}
	
	public DiaryResponse getDiary(String userId, String date) {
		DiaryResponse response = diaryDynamoRepository.getDiary(userId, date);
		response.setUserId(userId);
		response.setStartTime(userId);
		return response;
	}
}
