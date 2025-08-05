package com.slack_timesmanager.diary;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

@Service
public class DiaryService {
	private static final Logger log = LoggerFactory.getLogger(DiaryService.class);
	private DiaryDynamoRepository diaryDynamoRepository;

	public DiaryService(DiaryDynamoRepository diaryDynamoDbRepository) {
		this.diaryDynamoRepository = diaryDynamoDbRepository;
	}

	public ServiceResult save(DiaryRequest request){
		try {
			DiaryResponse getRes = diaryDynamoRepository.getDiary(request.getUserId(), request.getDate());
			
			if(getRes != null) {
				diaryDynamoRepository.updateItem(request);
			} else {
				diaryDynamoRepository.putItem(request);
			}
			return ServiceResult.success();
		}
		catch(Exception e) {
			e.printStackTrace();
			log.error("DynamoDB処理中にエラー", e);
			return ServiceResult.failure();
		}
	}
	
	public ServiceResult getDiary(String userId, String date) {
		try {
			DiaryResponse response = diaryDynamoRepository.getDiary(userId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {
			e.printStackTrace();
			log.error("DynamoDB処理中にエラー", e);
			return ServiceResult.failure();
		}
	}
}
