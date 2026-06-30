package com.timesmanager.api.feature.task.domain;

import com.timesmanager.api.common.core.Domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Task implements Domain {

    private final String userId;
    private final String serial;
    private final String date;
    private final String taskName;
    private final String memo;
}