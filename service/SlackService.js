// モジュール読み込み
const networkUtils = require('../utility/NetworkUtils.js');
const { SlackConstants } = require('../constants/SlackConstants');

class SlackService{
    constructor(){};

    // Slack投稿のURL取得
    async getPermalink (diaryModel) {
        var eventTs = diaryModel.eventTs;
        var channel = diaryModel.channel;
        var headers = {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_USER_ACCESS_TOKEN
        }
        const url = `${SlackConstants.URL.getPermalink}?channel=${channel}&message_ts=${eventTs}`;
        var response = await networkUtils.sendHttpRequest(url, 'GET', headers, undefined);
        return JSON.parse(response).permalink;
    }
}

exports.SlackService = SlackService;