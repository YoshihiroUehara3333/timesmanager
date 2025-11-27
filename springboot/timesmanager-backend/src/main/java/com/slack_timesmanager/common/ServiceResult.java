package com.slack_timesmanager.common;

public class ServiceResult<T> {

    private final boolean success;
    private final T body;
    private final String errorCode;
    private final String message;

    private ServiceResult(
    		boolean success,
    		T body,
    		String errorCode,
    		String message
    ) {
        this.success = success;
        this.body = body;
        this.errorCode = errorCode;
        this.message = message;
    }

    // ===== factory methods =====
    /** ボディなし成功 */
    public static <T> ServiceResult<T> success() {
        return new ServiceResult<>(true, null, null, null);
    }

    /** ボディあり成功 */
    public static <T> ServiceResult<T> success(T body) {
        return new ServiceResult<>(true, body, null, null);
    }

    /** メッセージのみ失敗 */
    public static <T> ServiceResult<T> failure(String message) {
        return new ServiceResult<>(false, null, null, message);
    }

    /** メッセージ・エラーコード付き失敗（必要になったら使う） */
    public static <T> ServiceResult<T> failure(String errorCode, String message) {
        return new ServiceResult<>(false, null, errorCode, message);
    }

    public boolean isSuccess() {
        return success;
    }
    public T getBody() {
        return body;
    }
    public String getErrorCode() {
        return errorCode;
    }
    public String getMessage() {
        return message;
    }
}
