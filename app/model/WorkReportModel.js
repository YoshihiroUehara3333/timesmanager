// 作業経過のデータ構造定義クラス
class WorkReportModel {
    constructor () {
        this._date = '';
        this._userId = '';
        this._channel = '';
        this._threadTs = '';
        this._slackUrl = '';
        this._workPlan = '';
        this._selectedTime = '';
        this._option = '';
    };

    toItem () {
        return {
            date          : this._date,
            user_id       : this._userId,
            channel       : this._channel,
            event_ts      : this._threadTs,
            slack_url     : this._slackUrl,
            work_plan     : this._workPlan,
            selected_time : this._selectedTime,
            option        : this._option,
        }
    };

    get partitionKeyBase() {
        return this._userId + this._channel + this._date;
    };

    get workPlan() {
        return this._workPlan;
    };

    set workPlan(workPlan) {
        this._workPlan = workPlan;
    };

    get selectedTime() {
        return this._selectedTime;
    };

    set selectedTime(selectedTime) {
        this._selectedTime = selectedTime;
    };

    get option() {
        return this._option;
    };

    set option(option) {
        this._option = option;
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
}

exports.WorkReportModel = WorkReportModel;