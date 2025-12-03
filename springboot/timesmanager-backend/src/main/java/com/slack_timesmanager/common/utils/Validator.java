package com.slack_timesmanager.common.utils;

public class Validator {

    public static void validateUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId は必須です");
        }
    }

    public static void validateDate(String date) {
        if (date == null || date.isEmpty()) {
            throw new IllegalArgumentException("date は必須です");
        }
    }
}
