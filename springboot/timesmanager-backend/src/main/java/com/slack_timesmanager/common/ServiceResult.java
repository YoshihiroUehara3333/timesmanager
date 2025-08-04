package com.slack_timesmanager.common;

import com.slack_timesmanager.core.Response;

public class ServiceResult {
	boolean status;
	Response response;
	
	public ServiceResult() {
		this.status = true;
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
}
