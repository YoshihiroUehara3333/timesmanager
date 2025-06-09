// 日記のデータ構造定義クラス

// モジュール読み込み
const { PostDataBaseModel } = require('./PostDataBaseModel');

class DiaryModel extends PostDataBaseModel {
    constructor (channelId, date) {
        super(channelId, date);
        this._sortKeyPrefix = PostDataBaseModel.POSTDATA.SORT_KEY_PREFIX.DIARY;

        this._workingPlaceCd   = 9;
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
        const ATTR_NAMES = PostDataBaseModel.POSTDATA.ATTR_NAMES;
        return {
            [ATTR_NAMES.PARTITION_KEY]      : this.partitionKey,
            [ATTR_NAMES.SORT_KEY]           : this.sortKey,
            [ATTR_NAMES.DATE]               : this.date,
            [ATTR_NAMES.THREAD_TS]          : this.threadTs,
            [ATTR_NAMES.SLACK_URL]          : this.slackUrl,
            [ATTR_NAMES.WORKING_PLACE_CD]   : this.workingPlaceCd,
            [ATTR_NAMES.CONTENT]            : { ...this._content },
            [ATTR_NAMES.POSTED_AT]          : this.postedAt,
            [ATTR_NAMES.EDITED_AT]          : this.editedAt,
        }
    }

    get date () {
        return this._date;
    }

    set date (date) {
        this._date = date;
    }

    get workingPlaceCd () {
        return this._workingPlaceCd;
    }
    
    set workingPlaceCd (workingPlaceCd) {
        this._workingPlaceCd = workingPlaceCd;
    }

    get slackUrl() {
        return this._slackUrl;
    }

    set slackUrl(slackUrl) {
        this._slackUrl = slackUrl;
    }

    get threadTs() {
        return this._threadTs;
    }

    set threadTs(threadTs) {
        this._threadTs = threadTs;
    }

    get postedAt () {
        return this._postedAt;
    }

    set postedAt (postedAt) {
        this._postedAt = postedAt;
    }

    get editedAt () {
        return this._editedAt;
    }

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
