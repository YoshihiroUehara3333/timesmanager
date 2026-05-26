package com.timesmanager.api.feature.thread.domain;

import com.timesmanager.api.common.core.Domain;

import lombok.Getter;

@Getter
public class ThreadDomain implements Domain {
    private final String channelId;
    private final String date;
    private final String userId;
    private final String threadTs;
    private final String permalink;

    private ThreadDomain(
            String channelId,
            String date,
            String userId,
            String threadTs,
            String permalink
    ) {
        this.channelId = channelId;
        this.date = date;
        this.userId = userId;
        this.threadTs = threadTs;
        this.permalink = permalink;
    }

    public static ThreadDomain create(
            String channelId,
            String date,
            String userId,
            String threadTs,
            String permalink
    ) {
        return new ThreadDomain(
                channelId,
                date,
                userId,
                threadTs,
                permalink
        );
    }
}