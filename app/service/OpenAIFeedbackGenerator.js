// モジュール読み込み
const { OpenAI } = require("openai");
const { DiaryUtils } = require("../utility/DiaryUtils.js");
const { Prompts } = require("./prompts/Prompts");

class OpenAIFeedbackGenerator {
    constructor() {
        this.openAI = new OpenAI({
            apiKey  : process.env.OPENAI_API_KEY,
            timeout : 180000 // ms指定
        })
    }

    // AIによる日報のフィードバックを生成
    async generateFeedback(diary) {
        console.log("generateFeedback", JSON.stringify(diary));

        console.log(`prompt:${Prompts.feedback}`);
        console.log(`model:${process.env.GPT_MODEL}`);
        try {
            const response = await this.openAI.chat.completions.create({
                // OpenAIのモデル一覧
                // https://platform.openai.com/docs/models
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

exports.OpenAIFeedbackGenerator = OpenAIFeedbackGenerator;