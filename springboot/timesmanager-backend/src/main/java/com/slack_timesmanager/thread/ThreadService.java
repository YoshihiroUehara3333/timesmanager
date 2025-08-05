package com.slack_timesmanager.thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;
import com.slack_timesmanager.diary.DiaryDynamoRepository;

@Service

public class ThreadService {
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
	private DiaryDynamoRepository diaryDynamoRepository;

	public ThreadService(DiaryDynamoRepository diaryDynamoDbRepository) {
		this.diaryDynamoRepository = diaryDynamoDbRepository;
	}

	public ServiceResult save(ThreadRequest request){
		try {
			ThreadResponse getRes = null;
			
			if(getRes != null) {

			} else {

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
			ThreadResponse response = null;
			return ServiceResult.success(response);
		}
		catch(Exception e) {
			e.printStackTrace();
			log.error("DynamoDB処理中にエラー", e);
			return ServiceResult.failure();
		}
	}
}
