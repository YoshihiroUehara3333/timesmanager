exports.SlackConst = {
    ID: {
        botUserId: process.env.SLACK_BOT_USER_ID,
    },
    URL: {
        getPermalink: "https://slack.com/api/chat.getPermalink",
    },
    COMMAND : {
        makeThread  : "/makethread",
        warmUp      : "/warmup",
    },
};