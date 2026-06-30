package com.timesmanager.api.common.exception;

import com.timesmanager.api.common.core.Domain;

public class ConflictException extends RuntimeException{
	
	private Domain domain;

	public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
	
	public <T extends Domain>ConflictException(String message, Throwable cause, T domain) {
        super(message, cause);
        this.domain = domain;
    }
    public Domain getDomain() {
        return domain;
    }
}
