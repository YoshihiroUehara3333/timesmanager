// スレッド内投稿のデータ構造定義クラス

// モジュール読み込み
const { PostDataBaseModel } = require('./PostDataBaseModel');
const { POSTDATA }          = require('../constants/DynamoDB/PostData');

class PostModel extends PostDataBaseModel {

    constructor (channelId, date, threadTs) {
        super(channelId, date);
        this._sortKeyPrefix = POSTDATA.SORT_KEY_PREFIX.POSTS;

        this._threadTs       = threadTs;
        this._serial         = ''; // GSI
        this._postTypeCd     = '';
        this._postedAt       = 'hh:mm';
        this._content = {
            text : '',
        }
    }

    toItem () {
        const ATTR_NAMES = POSTDATA.ATTR_NAMES;
        return {
            [ATTR_NAMES.PARTITION_KEY]   : this.partitionKey,
            [ATTR_NAMES.SORT_KEY]        : this.sortKey,
            [ATTR_NAMES.DATE]            : this._date,
            [ATTR_NAMES.SERIAL]          : this._serial,
            [ATTR_NAMES.POST_TYPE_CD]    : this._postTypeCd,
            [ATTR_NAMES.POSTED_AT]       : this._postedAt,
            [ATTR_NAMES.CONTENT]         : { ...this._content },
        }
    }

    get date () {
        return this._date;
    }

    set date (date) {
        this._date = date;
    }

    get postTypeCd () {
        return this._postTypeCd;
    }

    set postTypeCd (postTypeCd) {
        this._postTypeCd = postTypeCd;
    }

    get serial () {
        return this._serial;
    }

    set serial (serial) {
        this._serial = serial;
    }

    get threadTs() {
        return this._threadTs;
    };

    set threadTs(threadTs) {
        this._threadTs = threadTs;
    };

    get postedAt () {
        return this._postedAt;
    };

    set postedAt (postedAt) {
        this._postedAt = postedAt;
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
    }
}

exports.PostModel = PostModel;
