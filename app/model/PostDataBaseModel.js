// モジュール読み込み
const { POSTDATA } = require('../constants/DynamoDB/DynamoDBConst');

class PostDataBaseModel {
    constructor(channelId, date) {
        this._channelId     = channelId;
        this._date          = date;

        this._sortKeyPrefix = '';
    }

    static get POSTDATA() {
        return POSTDATA;
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