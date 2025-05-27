// モジュール読み込み
class ReplyModel {
    constructor() {}

    toItem () {
        return {
            date: this._date,
            user_id: this._userId,
            event_ts: this._eventTs,
            thread_ts: this._threadTs,
            channel: this._channel
        }
    };
}

exports.ReplyModel = ReplyModel;