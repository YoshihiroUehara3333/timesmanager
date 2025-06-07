// DB関連の定数定義
const POSTDATA_COLUMN_NAMES = {
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
    WORKING_PLACE_CD   : 'working_place_cd'
};

const USERDATA_COLUMN_NAMES = {
    PARTITION_KEY : 'channel_id',
};

exports.DBConst = {
    COLUMN_NAMES  : {
        POSTDATA : POSTDATA_COLUMN_NAMES,
        USERDATA : USERDATA_COLUMN_NAMES,
    },
    SORT_KEY_PREFIX : {
        DIARY           : 'Diary',
        WORKREPORT      : 'Workreport',
        THREAD          : 'Thread',
        POSTS           : 'Posts',
    },
    GSI : {
        ByDateAndSortKey: {
            NAME : 'GSI_ByDate_SortKeyPrefix',
            PK   : POSTDATA_COLUMN_NAMES.DATE,
            SK   : POSTDATA_COLUMN_NAMES.SORT_KEY,
        },
        ByThreadTsAndSortKeyPrefix: {
            NAME : 'GSI_ByThreadTs_SortKeyPrefix',
            PK   : POSTDATA_COLUMN_NAMES.THREAD_TS,
            SK   : POSTDATA_COLUMN_NAMES.SORT_KEY,
        },
    }
}
