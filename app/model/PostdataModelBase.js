// モジュール読み込み
class PostdataModelBase {
    constructor(channelId, date) {
        this._channelId     = channelId;
        this._date          = date;
        this._serial        = null;

        this._partitionKeyPrefix = '';
    }

    toItem () {
    }

    get partitionKey () {
        return `${this._channelId}#${this._partitionKeyPrefix}`;
    }

    get sortKey() {
        return `${this._date}#${this._serial}`;
    }

    get date () {
        return this._date;
    }

    set date (date) {
        this._date = date;
    }

    get serial () {
        if (this._serial) {
            return this._serial;
        } else {
            return '';
        }
    }

    set serial (serial) {
        this._serial = serial;
    }
}

exports.PostdataModelBase = PostdataModelBase;