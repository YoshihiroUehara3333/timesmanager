// postdataテーブルの定数

const ATTR_NAMES = {
    PARTITION_KEY      : 'partition_key',
    SORT_KEY           : 'sort_key',
    DATE               : 'date',
    THREAD_TS          : 'thread_ts',
    SLACK_URL          : 'slack_url',
    SERIAL             : 'serial',
    CONTENT            : 'content',
    POSTED_AT          : 'posted_at',
    EDITED_AT          : 'edited_at',
    CREATED_AT         : 'created_at',
    POST_TYPE_CD       : 'post_type_cd',
    WORKING_PLACE_CD   : 'working_place_cd',
}

const PK_POSTFIX = {
    DIARY           : 'Diary',
    WORKREPORT      : 'Workreport',
    THREAD          : 'Thread',
    POSTS           : 'Posts',
}

const GSI = {
    ByDateAndSortKeyPrefix: {
        NAME : 'GSI_ByDate_SortKeyPrefix',
        PK   : ATTR_NAMES.DATE,
        SK   : ATTR_NAMES.SORT_KEY,
    },
    ByThreadTsAndSortKeyPrefix: {
        NAME : 'GSI_ByThreadTs_SortKeyPrefix',
        PK   : ATTR_NAMES.THREAD_TS,
        SK   : ATTR_NAMES.SORT_KEY,
    }
}

exports.POSTDATA = {
    ATTR_NAMES      : ATTR_NAMES,
    PK_POSTFIX      : PK_POSTFIX,
    GSI             : GSI,
}
