package com.slack_timesmanager.common.exception;

public class ConflictException extends RuntimeException{

	public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
