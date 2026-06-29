package com.timesmanager.api.feature.task.domain;

import com.timesmanager.api.common.core.Domain;

import lombok.Getter;

@Getter
public class Task implements Domain {

    private final String userId;
    private final String serial;
    private final String date;
    private final String taskName;
    private final String memo;

    private Task(
            String userId,
            String serial,
            String date,
            String taskName,
            String memo
    ) {
        this.userId = userId;
        this.serial = serial;
        this.date = date;
        this.taskName = taskName;
        this.memo = memo;
    }

    public static Task create(
            String userId,
            String serial,
            String date,
            String taskName,
            String memo
    ) {
        return new Task(
                userId,
                serial,
                date,
                taskName,
                memo
        );
    }
}