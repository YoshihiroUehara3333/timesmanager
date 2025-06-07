// 日記のデータ構造定義クラス

// モジュール読み込み
const { DBConst } = require('../constants/DBConst');

class DiaryModel {
    _sortKeyBase = DBConst.SORT_KEY_BASE.DIARY;

    constructor (channelId) {
        this._channelId        = channelId;

        this._date             = '';
        this._attendanceTypeCd = '';
        this._threadTs         = '';
        this._slackUrl         = '';
        this._postedAt         = '';
        this._editedAt         = '';
        this._content = {
            working_time : {
                start : 'hh:mm',
                end   : 'hh:mm',
            },
            work_report  : '',
            evaluation   : '',
            plan         : '',
            other        : ''
        }
    }

    toItem () {
        const COLNAMES = DBConst.COLUMN_NAMES.POSTDATA;
        return {
            [COLNAMES.PARTITION_KEY]      : this.partitionKey,
            [COLNAMES.SORT_KEY]           : this.sortKey,
            [COLNAMES.DATE]               : this.date,
            [COLNAMES.THREAD_TS]          : this.threadTs,
            [COLNAMES.SLACK_URL]          : this.slackUrl,
            [COLNAMES.ATTENDANCE_TYPE_CD] : this.attendanceTypeCd,
            [COLNAMES.CONTENT]            : { ...this._content },
            [COLNAMES.POSTED_AT]          : this.postedAt,
            [COLNAMES.EDITED_AT]          : this.editedAt,
        }
    }

    get partitionKey () {
        return `${this._channelId}`;
    }

    get sortKey() {
        return `${this._sortKeyBase}#${date}`;
    }

    get date () {
        return this._date;
    }

    set date (date) {
        this._date = date;
    }

    get attendanceTypeCd () {
        return this._attendanceTypeCd;
    }
    
    set attendanceTypeCd (attendanceTypeCd) {
        this._attendanceTypeCd = attendanceTypeCd;
    };

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

    get postedAt () {
        return this._postedAt;
    };

    set postedAt (postedAt) {
        this._postedAt = postedAt;
    }

    get editedAt () {
        return this._editedAt;
    };

    set editedAt (editedAt) {
        this._editedAt = editedAt;
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
    }
}

exports.DiaryModel = DiaryModel;
