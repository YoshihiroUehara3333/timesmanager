// DB関連の定数定義

exports.DBConst = {
    POST_CATEGORY: {
        DIARY: "00",
        THREAD: "10",
        REPLY: "11",
        URL: "12",
        AI: {
            SUMMARY: 90,
        }
    },
    GSI_NAME: {
        EVENT_TS: "event_ts-index",
    },
    GSI_PARTITION: {
        EVENT_TS: "event_ts",
    },
};
