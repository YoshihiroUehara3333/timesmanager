package com.slack_timesmanager.common.exception;

public class InfrastructureException extends RuntimeException{
    public InfrastructureException(String message) {
        super(message);
    }
    
    public InfrastructureException(String message, RuntimeException e) {
        super(message);
    }
}
