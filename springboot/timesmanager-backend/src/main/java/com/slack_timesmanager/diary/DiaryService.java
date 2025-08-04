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
		ServiceResult result = new ServiceResult();
		
		try {
			DiaryResponse getRes = diaryDynamoRepository.getDiary(request.getUserId(), request.getDate());
			
			if(getRes != null) {
				diaryDynamoRepository.updateItem(request);
			}
			else {
				diaryDynamoRepository.putItem(request);
			}
			return result;
		}
		catch(Exception e) {
			e.printStackTrace();
			log.error("DynamoDB処理中にエラー", e);
			result.setStatus(false);
			return result;
		}
	}
	
	public ServiceResult getDiary(String userId, String date) {
		ServiceResult result = new ServiceResult();
		
		try {
			DiaryResponse response = diaryDynamoRepository.getDiary(userId, date);
			result.setResponse(response);
			return result;
		}
		catch(Exception e) {
			e.printStackTrace();
			log.error("DynamoDB処理中にエラー", e);
			result.setStatus(false);
			return result;
		}
	}
}
