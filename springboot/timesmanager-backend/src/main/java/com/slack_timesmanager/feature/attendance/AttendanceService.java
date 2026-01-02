package com.slack_timesmanager.feature.attendance;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.ConflictException;
import com.slack_timesmanager.common.exception.InfrastructureException;
import com.slack_timesmanager.common.utils.Validator;
import com.slack_timesmanager.feature.attendance.domain.AttendanceDomain;
import com.slack_timesmanager.feature.attendance.domain.AttendanceDomainFactory;
import com.slack_timesmanager.feature.attendance.dto.AttendanceRequest;
import com.slack_timesmanager.feature.attendance.dto.AttendanceResponse;

@Service
public class AttendanceService {

	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(AttendanceService.class);
	
	private final AttendanceDynamoRepository attendanceDynamoRepository;

	public AttendanceService(AttendanceDynamoRepository attendanceDynamoRepository) {
		this.attendanceDynamoRepository = attendanceDynamoRepository;
	}
	

    /**
     * 勤怠の新規登録 or 更新（同一 userId + date があれば更新、それ以外は登録）
     */
	public AttendanceResponse save(AttendanceRequest request){
		AttendanceDomain attendance = AttendanceDomainFactory.fromAttendanceRequest(request);
		try {
			attendanceDynamoRepository.putItem(attendance);
		}
		catch(ConflictException e) {
			attendanceDynamoRepository.updateItem(attendance);
		}
		catch(RuntimeException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("DynamoDB error", e);
		}
		
		return AttendanceResponse.fromDomain(attendance);
	}
	
    /**
     * 勤怠情報取得（userId）
     */
	public List<AttendanceResponse> getAllByUserId(String userId) {
		Validator.validateUserId(userId);
		
		try {
			List<AttendanceDomain> attendances = attendanceDynamoRepository.findAllByUserId(userId);
			return attendances.stream()
					.map(AttendanceResponse::fromDomain)
					.toList();
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getAttendanceResponse userId={}", userId,  e);
			throw new InfrastructureException("DynamoDB error", e);
		}
	}
	
    /**
     * 勤怠情報取得（userId + date）
     */
	public List<AttendanceResponse> getByUserIdAndDate(String userId, String date) {
		Validator.validateUserId(userId);
		Validator.validateDate(date);
		
		try {
			List<AttendanceDomain> attendances = attendanceDynamoRepository.findByUserIdAndDate(userId, date);
			return attendances.stream()
					.map(AttendanceResponse::fromDomain)
					.toList();
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getAttendanceResponse userId={}, date={}", userId, date, e);
			throw new InfrastructureException("DynamoDB error", e);
		}
	}
}
