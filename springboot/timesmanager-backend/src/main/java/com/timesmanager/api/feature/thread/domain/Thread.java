package com.timesmanager.api.feature.thread.domain;

import com.timesmanager.api.common.core.Domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Thread implements Domain {
    String channelId;
    String date;
    String userId;
    String threadTs;
    String permalink;
}