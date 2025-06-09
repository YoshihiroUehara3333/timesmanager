// channeldataテーブルの定数

const ATTR_NAMES = {
    PARTITION_KEY      : 'channel_id',
    SORT_KEY           : '',
}

const SORT_KEY_PREFIX = {
}

const GSI = {
}

exports.ChannelData = {
    ATTR_NAMES      : ATTR_NAMES,
    SORT_KEY_PREFIX : SORT_KEY_PREFIX,
    GSI             : GSI,
}