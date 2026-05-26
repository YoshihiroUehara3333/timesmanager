package com.timesmanager.api.common.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FieldErrorInfo {
    private String field;
    private String message;

    public FieldErrorInfo(String field, String message) {
        this.field = field;
        this.message = message;
    }
}
