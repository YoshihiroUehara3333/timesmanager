package com.slack_timesmanager.thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.slack_timesmanager.common.ServiceResult;

@Service

public class ThreadService {
	private static final Logger log = LoggerFactory.getLogger(ThreadService.class);

	public ThreadService() {
	}

	public ServiceResult save(ThreadRequest request){
		return null;
	}
	
	public ServiceResult getThread(String userId, String date) {
		return null;
	}
}
