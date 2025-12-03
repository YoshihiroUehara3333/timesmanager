package com.slack_timesmanager.feature.diary;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;
import com.slack_timesmanager.feature.diary.dto.DiaryRequest;
import com.slack_timesmanager.feature.diary.dto.DiaryResponse;

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
	public void save(DiaryRequest request){
		try {
			List<DiaryResponse> getRes = diaryDynamoRepository.getDiary(request.getUserId(), request.getDate());
			
			if(getRes.isEmpty()) {
				diaryDynamoRepository.putItem(request);
			} else {
				diaryDynamoRepository.updateItem(request);
			}
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("日記のDB更新に失敗しました", e);
		}
	}
	
    /**
     * 日報取得（userId + date）
     */
	public List<DiaryResponse> getDiary(String userId, String date) {
		try {
			return diaryDynamoRepository.getDiary(userId, date);
		}
		catch(RuntimeException e) {          
			log.error("DynamoDB処理中にエラー: getDiary userId={}, date={}", userId, date, e);
			throw new InfrastructureException("タスク一覧の取得に失敗しました", e);
		}
	}
}
