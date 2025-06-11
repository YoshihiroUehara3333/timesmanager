// SlackAPIへ送るRequestDTO

// chat.postMessage
// https://api.slack.com/methods/chat.postMessage
class PostMessage {
    constructor(
        channelId, 
        text,
        threadTs,
        blocks,
    ){
        this._channelId = channelId || null;
        this._text      = text || null;
        this._threadTs  = threadTs || null;
        this._blocks    = blocks || null;
        this._mrkdwn    = true;

        this.validate();
    }

    validate () {
        if (!this._channelId || typeof this._channelId !== 'string') {
            throw new Error("SlackPostMessageRequest: channelId is required and must be a string.");
        }
        if (!this._text || typeof this._text !== 'string') {
            throw new Error("SlackPostMessageRequest: text is required and must be a string.");
        }
    }

    toPayload () {
        let payload = {};
        payload.channel    = this._channelId;
        payload.text       = this._text;
        payload.thread_ts  = this._threadTs ?? undefined;
        payload.blocks     = this._blocks  ?? undefined;
        payload.mrkdwn     = this._mrkdwn ?? true;
        return payload;
    }
}

// chat.getpermalink
// https://api.slack.com/methods/chat.getpermalink
class GetPermaLink {
    constructor (
        channelId,
        messageTs,
    ) {
        this._channelId = channelId || null;
        this._messageTs = messageTs || null;

        this.validate();
    }

    validate () {
        if (!this._channelId || typeof this._channelId !== 'string') {
            throw new Error("SlackGetPermaLinkRequest: channelId is required and must be a string.");
        }
        if (!this._messageTs || typeof this._messageTs !== 'string') {
            throw new Error("SlackGetPermaLinkRequest: messageTs is required and must be a string.");
        }
    }

    toPayload() {
        let payload = {}
        payload.channel = this._channelId;
        payload.message_ts = this._messageTs;
        return payload;
    }
}

// views.open
// https://api.slack.com/methods/views.open
class ViewsOpen {
    constructor (
        triggerId,
        view,
    ) {
        this._triggerId = triggerId;
        this._view      = view;

        this.validate();
    }

    validate() {
        if (!this._triggerId || typeof this._triggerId !== 'string') {
            throw new Error("SlackViewsOpenRequest: channelId is required and must be a string.");
        }
        if (!this._view || typeof this._view !== 'object') {
            throw new Error("SlackViewsOpenRequest: messageTs is required and must be a object.");
        }
    }

    toPayload () {
        let payload = {};
        payload.trigger_id = this._triggerId;
        payload.view       = this._view;
        return payload;
    }
}

exports.PostMessage = PostMessage;
exports.ViewsOpen = ViewsOpen;
exports.GetPermaLink = GetPermaLink;