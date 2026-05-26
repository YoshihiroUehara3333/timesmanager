package com.timesmanager.api.feature.attendance;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.exception.InfrastructureException;
import com.slack_timesmanager.common.utils.Validator;
import com.timesmanager.api.feature.attendance.domain.AttendanceDomain;
import com.timesmanager.api.feature.attendance.domain.AttendanceDomainFactory;
import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;
import com.timesmanager.api.feature.attendance.dto.AttendanceResponse;

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
	public Optional<AttendanceResponse> getByUserIdAndDate(String userId, String date) {
		log.info("AttendanceService.getByUserIdAndDate: userId={}, date={}", userId, date);
		
		Validator.validateUserId(userId);
		Validator.validateDate(date);
		
		try {
			return attendanceDynamoRepository.findByUserIdAndDate(userId, date)
					.map(AttendanceResponse::fromDomain);
		}
		catch(RuntimeException e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
			throw new InfrastructureException("DynamoDB error", e);
		}
	}
}
