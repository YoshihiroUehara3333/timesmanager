package com.slack_timesmanager.common.exception;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidationErrorResponse {
    private String code;
    private String message;
    private List<FieldErrorInfo> errors;

    public ValidationErrorResponse(String code, String message, List<FieldErrorInfo> errors) {
        this.code = code;
        this.message = message;
        this.errors = errors;
    }
}
