// スレッド内投稿のデータ構造定義クラス

// モジュール読み込み
const { CdConst } = require('../constants/CdConst');
const { DBConst } = require('../constants/DBConst');

class PostModel {
    _sortKeyPrefix = DBConst.SORT_KEY_PREFIX.POSTS;

    constructor (channelId, threadTs) {
        this._channelId      = channelId;
        this._threadTs       = threadTs;

        this._serial         = ''; // GSI
        this._postTypeCd     = CdConst.WORKING_PLACE.getCodeByName('');
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
        return `${this._sortKeyPrefix}#${this._date}`;
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
