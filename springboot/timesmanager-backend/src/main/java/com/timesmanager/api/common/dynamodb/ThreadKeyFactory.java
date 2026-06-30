package com.timesmanager.api.common.dynamodb;

import com.timesmanager.api.common.enums.DynamoPK;

public class ThreadKeyFactory {
    // partition_key:userId + "/THREAD"
    // sort_key: YYYY-MM-DD

    /**
     * Thread: PK
     */
    public static String getPk(String userId) {
        return DynamoPK.THREAD.getPartitionKey(userId);
    }

    /**
     * Thread: SK
     */
    public static String getSk(String date) {
        return date;
    }
}
