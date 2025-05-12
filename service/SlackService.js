// モジュール読み込み
const networkUtils = require('../utility/NetworkUtils');
const { SlackURLConstants } = require('../constants/SlackURLConstants');

class SlackService{
    constructor(){

    };

    // Slack投稿のURL取得
    async getPermalink (diaryModel) {
        var eventTs = diaryModel.eventTs;
        var channel = diaryModel.channel;
        var headers = {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_USER_ACCESS_TOKEN
        }
        const url = `${SlackURLConstants.getPermalink}?channel=${channel}&message_ts=${eventTs}`;
        var response = await networkUtils.sendHttpRequest(url, 'GET', headers, undefined);
        return JSON.parse(response).permalink;
    }
}

exports.SlackService = SlackService;