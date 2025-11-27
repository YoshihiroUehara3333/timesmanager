package com.slack_timesmanager.diary;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

@Service
public class DiaryService {
	
	private static final Logger log = LoggerFactory.getLogger(DiaryService.class);
	
	private final DiaryDynamoRepository diaryDynamoRepository;

	public DiaryService(DiaryDynamoRepository diaryDynamoDbRepository) {
		this.diaryDynamoRepository = diaryDynamoDbRepository;
	}

    /**
     * 日報の新規登録 or 更新（同一 userId + date があれば更新、それ以外は登録）
     */
	public ServiceResult<Void> save(DiaryRequest request){
		try {
			List<DiaryResponse> getRes = diaryDynamoRepository.getDiary(request.getUserId(), request.getDate());
			
			if(getRes.isEmpty()) {
				diaryDynamoRepository.putItem(request);
			} else {
				diaryDynamoRepository.updateItem(request);
			}
			
			return ServiceResult.success();
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	}
	
    /**
     * 日報取得（userId + date）
     */
	public ServiceResult<List<DiaryResponse>> getDiary(String userId, String date) {
		try {
			List<DiaryResponse> response = diaryDynamoRepository.getDiary(userId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {            
			log.error("DynamoDB処理中にエラー: getDiary userId={}, date={}", userId, date, e);
			return ServiceResult.failure("DynamoDB error");
		}
	}
}
