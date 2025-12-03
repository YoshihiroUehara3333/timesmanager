package com.slack_timesmanager.feature.attendance;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	
	/** Logger */
	private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);
	
	private final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		this.attendanceService = attendanceService;
	}
	
	@PostMapping
	public ResponseEntity<Void> post(
			@RequestBody AttendanceRequest request
	){
		log.info("📥 Received POST /api/attendance: {}", request);
		
		boolean created = attendanceService.save(request);
		if(created) {
			return ResponseEntity.status(HttpStatus.CREATED).build();
		} else {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
	}

	@GetMapping
	public ResponseEntity<List<AttendanceResponse>> get(
			@RequestParam(required = true) String userId,
	        @RequestParam(required = false) String date
    ){
		log.info("📥 GET /api/attendance called. userId={}, date={}", userId, date);
		
		List<AttendanceResponse> responseBody = null;
		
		if (date == null) {
			responseBody = attendanceService.getAllByUserId(userId);
		} else {
			responseBody = attendanceService.getByUserIdAndDate(userId, date);
        }
		
		return ResponseEntity.ok(responseBody);
	}
}
