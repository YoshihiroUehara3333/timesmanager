package com.timesmanager.api.common.exception;

public class InfrastructureException extends RuntimeException{
    public InfrastructureException(String methodName, RuntimeException e) {
        super("DynamoDB " + methodName + " failed", e);
    }
}
