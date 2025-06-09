// OpenAIのモデル一覧
// https://platform.openai.com/docs/models
//
// API仕様ドキュメント
//

// モジュール読み込み
const { getOpenAiClient } = require('./OpenAIClientSingleton.js')
const { DiaryUtils } = require("../../utility/DiaryUtils.js");
const { Prompts } = require("./prompts/Prompts");

class OpenAiApiAdaptor {
    constructor() {
    }
    
    // OpenAIのAIによる日報のフィードバックを生成し、returnする
    async generateFeedback(diary) {
        console.log("generateFeedback", JSON.stringify(diary));
        try {
            console.log(`prompt:${Prompts.feedback}`);
            console.log(`model:${process.env.GPT_MODEL}`);
            const client = getOpenAiClient();
            const response = await client.chat.completions.create({
                model   : process.env.GPT_MODEL, 
                messages: [
                    { 
                        role    : "system", 
                        content : Prompts.feedback
                    },
                    { 
                        role    : "user", 
                        content : DiaryUtils.formatDiaryFromJson(diary),
                    }
                ],
                temperature: 0.3,
            });
            console.log(response);

            const feedback = response.choices[0].message.content.trim();
            return `使用モデル:${process.env.GPT_MODEL}\nフィードバック:\n ${feedback}`;
        } catch (error) {
            throw new Error(error.message || "OpenAI API error",{ cause: error });
        }
    }
};

exports.OpenAiApiAdaptor = OpenAiApiAdaptor;