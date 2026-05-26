package com.timesmanager.api.feature.attendance;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.timesmanager.api.feature.attendance.dto.AttendanceRequest;
import com.timesmanager.api.feature.attendance.dto.AttendanceResponse;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	
	/** Logger */
	private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);
	
	private final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		this.attendanceService = attendanceService;
	}
	
	/**
	 * 勤怠入力情報保存
	 * 
	 * @param request
	 * @return 成功:200
	 */
	@PutMapping
	public ResponseEntity<AttendanceResponse> put(
			@RequestBody @Valid AttendanceRequest request
	){
		log.info("Received PUT /api/attendance: {}", request);
		
		AttendanceResponse response = attendanceService.save(request);
		return ResponseEntity.ok(response);
	}

	/**
	 * 勤怠情報1件取得
	 * 
	 * @param userId
	 * @param date
	 * @return データ有: 200 OK
	 * @return データ0件: 204 No Content
	 */
	@GetMapping("/{date}")
	public ResponseEntity<AttendanceResponse> getByDate(
			@PathVariable String date,
			@RequestParam(required = true) String userId
    ){
		log.info("Received GET /api/attendance/" + date + " userId={}", userId, date);
		
		return attendanceService.getByUserIdAndDate(userId, date)
				.map((response) -> ResponseEntity.ok(response))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.NO_CONTENT).build());
	}
}
