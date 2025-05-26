// 日記のデータ構造定義クラス

// モジュール読み込み


class DiaryModel {
    constructor() {
        this._userId = '';
        this._channel = '';
        this._eventTs = '';
        this._content = {
            workingTime: '',
            work: '',
            evaluation: '',
            plan: '',
            other: ''
        };
        this._date = '';
        this._clientMsgId = '';
        this._editedTs = '';
        this._slackUrl = '';
    }

    toItem () {
        return {
            date: this._date,
            user_id: this._userId,
            event_ts: this._eventTs,
            content: { ...this._content },
            slack_url: this._slackUrl,
            edited_ts: this._editedTs,
            client_msg_id: this._clientMsgId,
            thread_ts: this._threadTs,
            channel: this._channel
        }
    };

    get partitionKeyBase() {
        return this._userId + this._channel + this._date;;
    };

    get userId() {
        return this._userId;
    };

    set userId(userId) {
        this._userId = userId;
    };

    get channel() {
        return this._channel;
    };

    set channel(channel) {
        this._channel = channel;
    };

    get slackUrl() {
        return this._slackUrl;
    };

    set slackUrl(slackUrl) {
        this._slackUrl = slackUrl;
    };

    get eventTs() {
        return this._eventTs;
    };

    set eventTs(eventTs) {
        this._eventTs = eventTs;
    };

    get editedTs () {
        return this._editedTs;
    };

    set editedTs (editedTs) {
        this._editedTs = editedTs;
    };

    get threadTs() {
        return this._threadTs;
    };

    set threadTs(threadTs) {
        this._threadTs = threadTs;
    };

    get date () {
        return this._date;
    };

    set date (date) {
        this._date = date;
    };

    get content(){
        return this._content;
    };

    set content(content){
        this._content = content;
    };

    get clientMsgId () {
        return this._clientMsgId;
    };

    set clientMsgId (clientMsgId) {
        this._clientMsgId = clientMsgId;
    };
}

exports.DiaryModel = DiaryModel;
