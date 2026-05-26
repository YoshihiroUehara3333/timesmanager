package com.timesmanager.api.common.exception;

public class ConflictException extends RuntimeException{

	public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
