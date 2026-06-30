package com.timesmanager.api.feature.dailyreport.domain;

import java.util.List;

import com.timesmanager.api.common.core.Domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DailyReport implements Domain{
	String channelId;
    String date;
    String userId;
	List<String> taskNames;
	List<String> impressions;
}
