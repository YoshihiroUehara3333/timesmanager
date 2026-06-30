package com.timesmanager.api.feature.thread.repository;

import java.util.List;
import java.util.Optional;

import com.timesmanager.api.common.core.Repository;
import com.timesmanager.api.feature.thread.domain.Thread;

public interface ThreadRepository extends Repository<Thread> {
	
	void save(Thread domain);
	
	Optional<Thread> findByUserIdAndDate(String userId, String date);
	
	List<Thread> findAllByUserId(String userId);
}
