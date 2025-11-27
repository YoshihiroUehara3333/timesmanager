package com.slack_timesmanager.attendance;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;
import com.slack_timesmanager.diary.DiaryRequest;
import com.slack_timesmanager.diary.DiaryResponse;

@Service
public class AttendanceService {

	private static final Logger log = LoggerFactory.getLogger(AttendanceService.class);
	
	private final AttendanceDynamoRepository attendanceDynamoRepository;

	public AttendanceService(AttendanceDynamoRepository attendanceDynamoRepository) {
		this.attendanceDynamoRepository = attendanceDynamoRepository;
	}
	

    /**
     * 勤怠の新規登録 or 更新（同一 userId + date があれば更新、それ以外は登録）
     */
	public ServiceResult<Void> save(DiaryRequest request){
		try {
			List<DiaryResponse> getRes = attendanceDynamoRepository.getAttendance(request.getUserId(), request.getDate());
			
			if(getRes.isEmpty()) {
				attendanceDynamoRepository.putItem(request);
			} else {
				attendanceDynamoRepository.updateItem(request);
			}
			
			return ServiceResult.success();
		}
		catch(Exception e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        return ServiceResult.failure("DynamoDB error");
		}
	}
	
    /**
     * 勤怠取得（userId + date）
     */
	public ServiceResult<List<AttendanceResponse>> getAttendance(String userId, String date) {
		try {
			List<AttendanceResponse> response = attendanceDynamoRepository.getAttendance(userId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {            
			log.error("DynamoDB処理中にエラー: getAttendanceResponse userId={}, date={}", userId, date, e);
			return ServiceResult.failure("DynamoDB error");
		}
	}
}
