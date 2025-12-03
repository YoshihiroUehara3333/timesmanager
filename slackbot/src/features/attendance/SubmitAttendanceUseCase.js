// src/features/attendance/SubmitAttendanceUseCase.js

class SubmitAttendanceUseCase {
    constructor({ slackGateway, backendGateway }) {
        this.slackGateway = slackGateway
        this.backendGateway = backendGateway
    }

    /**
     * 勤怠入力モーダルの内容を保存するユースケース
     *
     * @param {Object} params
     * @param {Object} params.view  - Slack view payload
     */
    async execute({ view }) {
        // 入力値を取得
        const metadata = JSON.parse(view.private_metadata)
        const values = view.state.values
        
        const attendance = {
            date: metadata.date,
            userId: metadata.user_id,
            startTime: values.starttime.start_time.selected_time,
            endTime: values.endtime.end_time.selected_time,
            workplace: values.workplace.select_workplace.selected_option.value,
        }
        
        // バックエンドにリクエスト送信
        await this.backendGateway.saveAttendance(attendance)

        // Slackメッセージを送信
    }
}

module.exports = { SubmitAttendanceUseCase }