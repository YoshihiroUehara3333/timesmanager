// OpenAIのクライアントインスタンスのSingletonクラス
const { OpenAI } = require("openai");

let instance = null;

function getOpenAiClient () {
    if (!instance) {
        instance = new OpenAI({
            apiKey  : process.env.OPENAI_API_KEY,
            timeout : 180000 // ms指定
        })
    }
    return instance;
}

exports.getOpenAiClient = getOpenAiClient;
