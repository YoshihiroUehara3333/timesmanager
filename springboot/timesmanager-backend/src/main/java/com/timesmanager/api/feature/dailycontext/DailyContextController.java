package com.timesmanager.api.feature.dailycontext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dailycontext")
public class DailyContextController {
	
	/* Logger */
	private static final Logger log = LoggerFactory.getLogger(DailyContextController.class);
	
	private final DailyContextService dailyContextService;

	public DailyContextController(DailyContextService dailyContextService) {
		this.dailyContextService = dailyContextService;
	}
	
	
}
