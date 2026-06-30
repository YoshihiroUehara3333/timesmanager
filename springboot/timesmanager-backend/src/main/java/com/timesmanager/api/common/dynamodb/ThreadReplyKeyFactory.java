package com.timesmanager.api.common.dynamodb;

import com.timesmanager.api.common.enums.DynamoPK;

public class ThreadReplyKeyFactory {
    // partition_key:userId + "/THREAD"
    // sort_key: YYYY-MM-DD + /REPLY/(replyTs)123456.789012

    /**
     * Thread: PK
     */
    public static String getPk(String userId) {
        return DynamoPK.THREAD.getPartitionKey(userId);
    }

    /**
     * Thread: SK
     */
    public static String getSk(String date, String replyTs) {
        return date;
    }
}
