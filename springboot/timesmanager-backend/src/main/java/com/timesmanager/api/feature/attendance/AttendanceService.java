package com.timesmanager.api.feature.attendance;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.timesmanager.api.common.exception.InfrastructureException;
import com.timesmanager.api.feature.attendance.domain.Attendance;
import com.timesmanager.api.feature.attendance.domain.AttendanceFactory;
import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;
import com.timesmanager.api.feature.attendance.dto.AttendanceResponse;

import software.amazon.awssdk.services.dynamodb.model.DynamoDbException;

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
		Attendance attendance = AttendanceFactory.from(request);
		try {
			attendanceDynamoRepository.updateItem(attendance);
			return AttendanceResponse.fromDomain(attendance);
		}
		catch(DynamoDbException e) {
	        log.error("DynamoDB処理中にエラー: save request={}", request, e);
	        throw new InfrastructureException("DynamoDB error", e);
		}
	}
	
    /**
     * 勤怠情報取得（userId）
     */
	public List<AttendanceResponse> getAllByUserId(String userId) {		
		try {
			List<Attendance> attendances = attendanceDynamoRepository.findAllByUserId(userId);
			return attendances.stream()
					.map(AttendanceResponse::fromDomain)
					.toList();
		}
		catch(DynamoDbException e) {            
			log.error("DynamoDB処理中にエラー: getAttendanceResponse userId={}", userId,  e);
			throw new InfrastructureException("DynamoDB error", e);
		}
	}
	
    /**
     * 勤怠情報取得（userId + date）
     * 
     */
	public Optional<AttendanceResponse> getByUserIdAndDate(String userId, String date) {
		log.info("AttendanceService.getByUserIdAndDate: userId={}, date={}", userId, date);
		
		try {
			return attendanceDynamoRepository.findByUserIdAndDate(userId, date)
					.map(AttendanceResponse::fromDomain);
		}
		catch(DynamoDbException e) {            
			log.error("DynamoDB処理中にエラー: getByUserIdAndDate userId={}, date={}", userId, date, e);
			throw new InfrastructureException("DynamoDB error", e);
		}
	}
}
