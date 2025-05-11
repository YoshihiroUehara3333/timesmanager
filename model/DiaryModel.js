
class DiaryModel {
    constructor(event){
        this._userId = event.user;
        this._channel = event.channel;
        this._slackUrl = '';

        if (event.edited) {
            this._editedTs = event.edited.ts;
        } else if (event.event_ts) {
            this._eventTs = event.event_ts;
        } 
        
        if (event.thread_ts) {
            this._threadTs = event.thread_ts;
        }
        this._date = this.parseDate(event.text);
        this._content = this.parseContent(event.text);

        this._partitionKey = this._userId + this._channel + this._date;
    };

    // event内のtextからcontentデータを抽出する
    parseContent (text) {
        const content = {
            workingTime: '',
            work: '',
            evaluation: '',
            plan: '',
            other: ''
        };

        const workingTimeMatch = text.match(/\*【時間】\*([^\n]+)/);
        const workMatch = text.match(/\*【業務内容】\*([\s\S]*?)\*【自己評価】\*/);
        const evaluationMatch = text.match(/\*【自己評価】\*([\s\S]*?)\*【翌日の計画】\*/);
        const planMatch = text.match(/\*【翌日の計画】\*([\s\S]*?)\*【その他】\*/);
        const otherMatch = text.match(/\*【その他】\*([\s\S]*)/);

        if (workingTimeMatch) content.workingTime = workingTimeMatch[1].trim();
        if (workMatch) content.work = workMatch[1].trim();
        if (evaluationMatch) content.evaluation = evaluationMatch[1].trim();
        if (planMatch) content.plan = planMatch[1].trim();
        if (otherMatch) content.other = otherMatch[1].trim();

        return content;
    };

    // textから日付を抽出する
    parseDate (text) {
        const dateMatch = text.match(/\*【日付】\*([^\n]+)/);
        if (dateMatch) {
            return dateMatch[1].trim();
        }
    }

    get userId() {
        return this._userId;
    };

    set userId(userId) {
        this._userId = userId;
    };

    get slackUrl() {
        return this._slackUrl;
    };

    set slackUrl(slackUrl) {
        this._slackUrl = slackUrl;
    };

    get partitionKey() {
        return this._partitionKey;
    };

    set partitionKey(partitionKey) {
        this._partitionKey = partitionKey;
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
}

exports.DiaryModel = DiaryModel;
