// 作業経過のデータ構造定義クラス

// モジュール読み込み
const { DBConst } = require('../constants/DBConst');

class WorkReportModel {
    _sortKeyPrefix = DBConst.SORT_KEY_PREFIX.WORKREPORT;

    constructor (channelId, threadTs, date) {
        this._channelId     = channelId;
        this._date          = date;

        this._serial        = ''; // GSI
        this._threadTs      = threadTs;
        this._createdAt     = 'hh:mm';
        this._content = {
            overview : '',
            goal     : '',
            progression : {
                target       : '',
                input_time   : 'hh:mm',
                memo         : '',
            },
        }
    }

    toItem () {
        const COLNAMES = DBConst.COLUMN_NAMES.POSTDATA;
        return {
            [COLNAMES.PARTITION_KEY]      : this.partitionKey,
            [COLNAMES.SORT_KEY]           : this.sortKey,
            [COLNAMES.SERIAL]             : this.serial,
            [COLNAMES.THREAD_TS]          : this.threadTs,
            [COLNAMES.CREATED_AT]         : this.createdAt,
            [COLNAMES.CONTENT]            : { ...this._content },
        }
    }

    get partitionKey () {
        return `${this._channelId}`;
    }

    get sortKey() {
        return `${this._sortKeyPrefix}#${this._date}`;
    }

    get createdAt () {
        return this._createdAt;
    };

    set createdAt (createdAt) {
        this._createdAt = createdAt;
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
    }
}

exports.WorkReportModel = WorkReportModel;