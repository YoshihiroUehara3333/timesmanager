// モジュール読み込み
const { OpenAI } = require("openai");
const { DiaryUtils } = require("../utility/DiaryUtils.js");
const { Prompts } = require("./prompts/Prompts");

class OpenAIFeedbackGenerator {
    constructor() {
        this.openAI = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 180000 // ms指定
        });
    }

    async generateFeedback(diaryJson) {
        console.log("generateFeedback", JSON.stringify(diaryJson));
        const prompt = Prompts.feedbackPrompt;

        console.log("prompt:", prompt);
        try {
            const response = await this.openAI.chat.completions.create({
                model: "gpt-3.5-turbo", // 使用モデル
                messages: [
                    { 
                        role: "system", 
                        content: prompt
                    },
                    { 
                        role: "user", 
                        content: DiaryUtils.formatDiaryFromJson(diaryJson) 
                    }
                ],
                temperature: 0.5,
            });
            console.log(JSON.stringify(response));

            const feedback = response.choices[0].message.content.trim();
            return `フィードバック:\n ${feedback}`
        } catch (error) {
            console.error("OpenAI APIエラー:", error);
            return  "フィードバックの生成に失敗しました。"
        }
    }
}

exports.OpenAIFeedbackGenerator = OpenAIFeedbackGenerator;