package com.slack_timesmanager.feature.task.dto;

import com.slack_timesmanager.common.core.Response;

public class TaskSerialResponse implements Response{

    private String serial;

    public TaskSerialResponse() {
    }

    public TaskSerialResponse(String serial) {
        this.serial = serial;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }
}