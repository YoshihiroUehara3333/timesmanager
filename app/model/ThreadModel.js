// スレッドのデータ構造定義クラス
const { DBConst } = require('../constants/DBConst');

class ThreadModel {
    _sortKeyPrefix = DBConst.SORT_KEY_PREFIX.THREAD;

    constructor (channelId) {
        this._channelId     = channelId; // パーティションキー
        this._date          = ''; // GSI
        this._threadTs      = '';
        this._slackUrl      = '';
        this._createdAt     = 'hh:mm';
    }

    toItem () {
        const COLNAMES = DBConst.COLUMN_NAMES.POSTDATA;
        return {
            [COLNAMES.PARTITION_KEY]      : this.partitionKey,
            [COLNAMES.SORT_KEY]           : this.sortKey,
            [COLNAMES.THREAD_TS]          : this.threadTs,
            [COLNAMES.DATE]               : this.date,
            [COLNAMES.SLACK_URL]          : this.slackUrl,
            [COLNAMES.CREATED_AT]         : this.createdAt,
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

    get slackUrl() {
        return this._slackUrl;
    };

    set slackUrl(slackUrl) {
        this._slackUrl = slackUrl;
    };

    get threadTs() {
        return this._threadTs;
    };

    set threadTs(threadTs) {
        this._threadTs = threadTs;
    };

    get createdAt () {
        return this._createdAt;
    };

    set createdAt (createdAt) {
        this._createdAt = createdAt;
    }
};

exports.ThreadModel = ThreadModel;