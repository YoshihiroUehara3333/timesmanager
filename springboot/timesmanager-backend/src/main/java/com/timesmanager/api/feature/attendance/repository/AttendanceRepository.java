package com.timesmanager.api.feature.attendance.repository;

import com.timesmanager.api.common.core.Repository;
import com.timesmanager.api.feature.attendance.domain.Attendance;

public interface AttendanceRepository extends Repository<Attendance>{
	void save(Attendance domain);
}
