package com.slack_timesmanager.common;

import com.slack_timesmanager.core.Response;

public class ServiceResult {
	boolean status;
	Response response;
	String message;
	
	public ServiceResult() {
		this.status = true;
	}
	
	public static ServiceResult success() {
		return new ServiceResult();
	}
	
	public static ServiceResult success(Response response) {
		ServiceResult result = new ServiceResult();
		result.setResponse(response);
		return result;
	}
	
	public static ServiceResult failure() {
		ServiceResult result = new ServiceResult();
		result.setStatus(false);
		return result;
	}
	
	public static ServiceResult failure(String message) {
		ServiceResult result = new ServiceResult();
		result.setStatus(false);
		result.setMessage(message);
		return result;
	}
	
	public boolean getStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public Response getResponse() {
		return response;
	}
	public void setResponse(Response response) {
		this.response = response;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
