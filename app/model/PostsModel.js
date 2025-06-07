// スレッド内投稿のデータ構造定義クラス

// モジュール読み込み
const { DBConst } = require('../constants/DBConst');

class PostModel {
    _sortKeyBase = DBConst.SORT_KEY_BASE.POSTS;

    constructor (channelId, threadTs) {
        this._channelId      = channelId;
        this._threadTs      = threadTs;

        this._serial         = ''; // GSI
        this._postTypeCd     = DBConst.POSTS.TYPE_CD.OTHER;
        this._postedAt       = 'hh:mm';
        this._content = {
            text : '',
        }
    }

    toItem () {
        const COLNAMES = DBConst.COLUMN_NAMES.POSTDATA;
        return {
            [COLNAMES.PARTITION_KEY]   : this.partitionKey,
            [COLNAMES.SORT_KEY]        : this.sortKey,
            [COLNAMES.DATE]            : this._date,
            [COLNAMES.SERIAL]          : this._serial,
            [COLNAMES.POST_TYPE_CD]    : this._postTypeCd,
            [COLNAMES.POSTED_AT]       : this._postedAt,
            [COLNAMES.CONTENT]         : { ...this._content },
        }
    }

    get partitionKey () {
        return `${this._channelId}`;
    }

    get sortKey() {
        return `${this._sortKeyBase}#${this._threadTs}`;
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
