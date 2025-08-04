package com.slack_timesmanager.diary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DiaryService {
	
	private static final Logger log = LoggerFactory.getLogger(DiaryController.class);
	
	private DiaryDynamoRepository diaryDynamoRepository;

	public DiaryService(DiaryDynamoRepository diaryDynamoDbRepository) {
		this.diaryDynamoRepository = diaryDynamoDbRepository;
	}

	public void save(DiaryRequest request) {
	}
	
	public DiaryResponse getByUserId(String userId) {
		DiaryResponse response = new DiaryResponse();
		return response;
	}
}
