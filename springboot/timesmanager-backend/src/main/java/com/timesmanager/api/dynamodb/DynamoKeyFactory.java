package com.timesmanager.api.dynamodb;

import com.timesmanager.api.common.enums.DynamoPK;

/**
 * DynamoDB の PK/SK を一元的に生成する Factory
 */
public final class DynamoKeyFactory {

    private DynamoKeyFactory() {
    }

    // ===== Task 用 =====
    // partition_key:userId + "/TASK"
    // sort_key = date + serial (例: "YYYY-MM-DD/001")
    /**
     * Task: ユーザ単位のパーティションキー
     */
    public static String taskPartitionKey(String userId) {
        return DynamoPK.TASK.getPartitionKey(userId);
    }

    /**
     * Task: 1件のタスクを一意に識別する PK/SK
     */
    public static DynamoKey taskItemKey(String userId, String date, String serial) {
        String pk = taskPartitionKey(userId);
        String sk = date + "/" + serial;
        return new DynamoKey(pk, sk);
    }

    // ===== Dailyreport 用 =====
    // partition_key:userId + "/DAILYREPORT"
    // sort_key: YYYY-MM-DD
    /**
     * : ユーザの日報 PK
     */
    public static String dailyreportPartitionKey(String userId) {
        return DynamoPK.DAILYREPORT.getPartitionKey(userId);
    }

    /**
     * : 1日分の日報 PK/SK
     */
    public static DynamoKey dailyreportItemKey(String userId, String date) {
        String pk = dailyreportPartitionKey(userId);
        String sk = date;
        return new DynamoKey(pk, sk);
    }

    // ===== Attendance 用 =====
    // partition_key:userId + "/ATTENDANCE"
    // sort_key: YYYY-MM-DD
    /**
     * Attendance: ユーザの勤怠 PK
     */
    public static String attendancePartitionKey(String userId) {
        return DynamoPK.ATTENDANCE.getPartitionKey(userId);
    }

    /**
     * Attendance: 1日分の勤怠 PK/SK
     */
    public static DynamoKey attendanceItemKey(String userId, String date) {
        String pk = attendancePartitionKey(userId);
        String sk = date;
        return new DynamoKey(pk, sk);
    }

    // ===== Thread 用 =====
    // partition_key:userId + "/THREAD"
    // sort_key: YYYY-MM-DD
    /**
     * Thread: PK
     */
    public static String threadPartitionKey(String userId) {
        return DynamoPK.THREAD.getPartitionKey(userId);
    }

    /**
     * Thread:  PK/SK
     */
    public static DynamoKey threadItemKey(String userId, String date) {
        String pk = threadPartitionKey(userId);
        String sk = date;
        return new DynamoKey(pk, sk);
    }
}
