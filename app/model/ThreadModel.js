// スレッドのデータ構造定義クラス

// モジュール読み込み
const { PostdataModelBase } = require('./PostdataModelBase');
const { POSTDATA }          = require('../constants/DynamoDB/PostData');

class ThreadModel extends PostdataModelBase {
    constructor (channelId, date) {
        super(channelId, date);
        this._partitionKeyPostfix = POSTDATA.PK_POSTFIX.THREAD;

        this._threadTs      = '';
        this._slackUrl      = '';
        this._createdAt     = 'hh:mm';
    }

    toItem () {
        const ATTR_NAMES = POSTDATA.ATTR_NAMES;
        return {
            [ATTR_NAMES.PARTITION_KEY]      : this.partitionKey,
            [ATTR_NAMES.SORT_KEY]           : this.sortKey,
            [ATTR_NAMES.THREAD_TS]          : this.threadTs,
            [ATTR_NAMES.SLACK_URL]          : this.slackUrl,
            [ATTR_NAMES.CREATED_AT]         : this.createdAt,
        }
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