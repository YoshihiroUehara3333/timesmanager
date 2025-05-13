class SlackConstants {
    static URL = {
        getPermalink: "https://slack.com/api/chat.getPermalink",
    }
    
    static ID = {
        botUserId: process.env.SLACK_BOT_USER_ID,
    }
}

exports.SlackConstants = SlackConstants;
