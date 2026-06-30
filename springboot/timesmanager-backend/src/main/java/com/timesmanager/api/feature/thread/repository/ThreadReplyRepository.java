package com.timesmanager.api.feature.thread.repository;

import com.timesmanager.api.common.core.Repository;
import com.timesmanager.api.feature.thread.domain.ThreadReply;

public interface ThreadReplyRepository extends Repository<ThreadReply> {
	void save(ThreadReply domain);
}	
