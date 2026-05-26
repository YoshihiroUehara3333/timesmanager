package com.slack_timesmanager.common.utils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class Validator {
	
	private static final String SLACK_USER_ID_PATTERN = "^U[A-Z0-9]{8,11}$";

    public static void validateUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId は必須です");
        }
        if (!userId.matches(SLACK_USER_ID_PATTERN)) {
        	throw new IllegalArgumentException("userId が不正です:" + userId);
        }
    }

    public static void validateDate(String date) {
        if (date == null || date.isEmpty()) {
            throw new IllegalArgumentException("date は必須です");
        }
        try {
            LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("date の形式が不正です: " + date);
        }
    }
}
