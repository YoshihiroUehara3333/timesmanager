package com.timesmanager.api.common.exception;

public class InfrastructureException extends RuntimeException{
    public InfrastructureException(String message, RuntimeException e) {
        super(message, e);
    }
}
