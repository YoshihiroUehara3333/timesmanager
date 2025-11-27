package com.slack_timesmanager.attendance;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.slack_timesmanager.common.ServiceResult;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	
	private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);
	
	private final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		this.attendanceService = attendanceService;
	}
	
	@PostMapping
	public ResponseEntity<Void> post(
			@RequestBody AttendanceRequest request)
	{
		log.info("📥 Received POST /api/attendance: {}", request);
		
		ServiceResult<Void> result = attendanceService.save(request);
		
		if(result.isSuccess()) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}

	@GetMapping
	public ResponseEntity<List<AttendanceResponse>> get(
			@RequestParam(required = true) String userId,
	        @RequestParam(required = false) String date
    ){
		log.info("📥 GET /api/attendance called. userId={}, date={}", userId, date);
		
		ServiceResult<List<AttendanceResponse>> result;
		
		if (date == null) {
			result = attendanceService.getAllByUserId(userId);
		} else {
			result = attendanceService.getByUserIdAndDate(userId, date);
        }
		
		if(result.isSuccess()) {
			return ResponseEntity.ok(result.getBody());
			
		} else {
			return ResponseEntity.internalServerError().build();
		}
	}
}
