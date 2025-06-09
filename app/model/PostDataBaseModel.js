// モジュール読み込み
const { POSTDATA } = require('../constants/DynamoDB/DynamoDBConst');

class PostDataBaseModel {
    POSTDATA = POSTDATA;
    _sortKeyPrefix = '';

    constructor(channelId, date) {
        this._channelId     = channelId;
        this._date          = date;
    }

    toItem () {
    }

    get partitionKey () {
        return `${this._channelId}`;
    }

    get sortKey() {
        return `${this._sortKeyPrefix}#${this._date}`;
    }
}

exports.PostDataBaseModel = PostDataBaseModel;