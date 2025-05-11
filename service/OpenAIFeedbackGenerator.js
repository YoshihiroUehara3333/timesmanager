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

    getPrompt (diaryJson) {
        return ""
            + "* あなたは業務日報のフィードバックを行うAIアシスタントです。" 
            + "* フィードバックは以下のフォーマットで書いてください。 \n"
            + "  + 良い点\n"
            + "  + 改善点\n"
            + "  + 総括\n"
            + "* 業務日報の内容を細かく読み、その内容について定性、定量的に評価し、建設的なフィードバックを生成してください。\n"
            + "  - 評価は若干厳しめにお願いします。\n"
    }

    async generateFeedback(diaryJson) {
        console.log("generateFeedback", JSON.stringify(diaryJson));
        const prompt = this.getPrompt();

        console.log("prompt:", prompt);
        try {
            const response = await this.openAI.chat.completions.create({
                model: "gpt-3.5-turbo", // 仕様モデル
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