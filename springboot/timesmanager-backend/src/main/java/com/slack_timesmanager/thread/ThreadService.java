package com.slack_timesmanager.thread;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

@Service
public class ThreadService {
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
	
	private final ThreadDynamoRepository threadDynamoRepository;
	
	public ThreadService(ThreadDynamoRepository threadDynamoRepository) {
		this.threadDynamoRepository = threadDynamoRepository;
	}

	public ServiceResult<Void> save(ThreadRequest request){
		try {
			List<ThreadResponse> getRes = threadDynamoRepository.findByChannelIdAndDate(request.getChannelId(), request.getDate());
			
			if(getRes.isEmpty()) {
				threadDynamoRepository.putItem(request);
			} else {
				return ServiceResult.failure("今日のスレッドは既に作成済です");
			}
			
			return ServiceResult.success();
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	}
	
    /**
     * チャンネルIDに紐づくスレッド情報を全件取得
     */
	public ServiceResult<List<ThreadResponse>> getAllByChannelId(String channelId) {
		try {
			List<ThreadResponse> response = threadDynamoRepository.findAllByChannelId(channelId);
			return ServiceResult.success(response);
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: getAllByChannelId channelId={}", channelId, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	};
	
	public ServiceResult<List<ThreadResponse>> getByChannelIdAndDate(String channelId, String date) {
		try {
			List<ThreadResponse> response = threadDynamoRepository.findByChannelIdAndDate(channelId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {            
			log.error("DynamoDB処理中にエラー: getByChannelIdAndDate channelId={}, date={}", channelId, date, e);
			return ServiceResult.failure("DynamoDB error");
		}
	}
}
