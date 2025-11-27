package com.slack_timesmanager.attendance;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

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
	public ServiceResult<Void> save(AttendanceRequest request){
		try {
			List<AttendanceResponse> getRes = attendanceDynamoRepository.findByUserIdAndDate(request.getUserId(), request.getDate());
			
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
     * 勤怠情報取得（userId）
     */
	public ServiceResult<List<AttendanceResponse>> getAllByUserId(String userId) {
		try {
			List<AttendanceResponse> response = attendanceDynamoRepository.findAllByUserId(userId);
			return ServiceResult.success(response);
		}
		catch(Exception e) {            
			log.error("DynamoDB処理中にエラー: getAttendanceResponse userId={}", userId,  e);
			return ServiceResult.failure("DynamoDB error");
		}
	}
	
    /**
     * 勤怠情報取得（userId + date）
     */
	public ServiceResult<List<AttendanceResponse>> getByUserIdAndDate(String userId, String date) {
		try {
			List<AttendanceResponse> response = attendanceDynamoRepository.findByUserIdAndDate(userId, date);
			return ServiceResult.success(response);
		}
		catch(Exception e) {            
			log.error("DynamoDB処理中にエラー: getAttendanceResponse userId={}, date={}", userId, date, e);
			return ServiceResult.failure("DynamoDB error");
		}
	}
}
