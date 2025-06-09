// 作業経過のデータ構造定義クラス

// モジュール読み込み
const { PostdataModelBase } = require('./PostdataModelBase');
const { POSTDATA }          = require('../constants/DynamoDB/PostData');

class WorkReportModel extends PostdataModelBase {
    constructor (channelId, date) {
        super(channelId, date);
        this._partitionKeyPostfix = POSTDATA.PK_POSTFIX.WORKREPORT;

        this._threadTs      = '';
        this._createdAt     = 'hh:mm';
        this._content = {
            taskName : '',
            goal     : '',
            progress: {
                targetTime   : 'hh:mm',
                memo         : '',
            },
        }
    }

    toItem () {
        const ATTR_NAMES = POSTDATA.ATTR_NAMES;
        return {
            [ATTR_NAMES.PARTITION_KEY]      : this.partitionKey,
            [ATTR_NAMES.SORT_KEY]           : this.sortKey,
            [ATTR_NAMES.SERIAL]             : this.serial,
            [ATTR_NAMES.THREAD_TS]          : this.threadTs,
            [ATTR_NAMES.CREATED_AT]         : this.createdAt,
            [ATTR_NAMES.CONTENT]            : { ...this._content },
        }
    }

    get createdAt () {
        return this._createdAt;
    }

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