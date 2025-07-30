package com.slack_timesmanager.thread;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class ThreadService {
	@Autowired
    private ThreadRepository threadRepository;
	
	public void save(ThreadRequest request) {
		
	}
}
