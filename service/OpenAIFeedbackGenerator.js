// モジュール読み込み
const { OpenAI } = require("openai");
const { DiaryUtils } = require("../utility/DiaryUtils.js");

class OpenAIFeedbackGenerator {
    constructor() {
        this.openAI = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 180000 // ms指定
        });
    }

    buildPrompt (diaryJson) {
        return ""
            + "* 以下は社員が書いた業務日報です。\n"
            + "* 内容を読み、簡潔で建設的なフィードバックを生成してください。\n"
            + "- 明日に向けて行動するべき課題を具体的に提示してください。\n"
            + DiaryUtils.formatDiaryFromJson(diaryJson);
    }

    async generateFeedback(diaryJson) {
        console.log("generateFeedback", JSON.stringify(diaryJson));
        const prompt = this.buildPrompt(diaryJson);

        console.log("prompt:", prompt);
        try {
            const response = await this.openAI.chat.completions.create({
                model: "gpt-3.5-turbo", // または "gpt-4"
                messages: [
                    { 
                        role: "system", 
                        content: "あなたは業務日報のフィードバックを行うAIアシスタントです。" 
                    },
                    { 
                        role: "user", 
                        content: prompt }
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