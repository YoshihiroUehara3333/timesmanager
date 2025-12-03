// src/features/task/application/StartTaskInputUseCase.js

const { TaskInputModal } = require('../blockkit/TaskInputModal')
const { TaskConst } = require('../../../shared/constants/TaskConst')
const { getDate } = require('../../../shared/utils/DateUtils')

class StartTaskInputUseCase {
    constructor({ slackGateway, taskBackendGateway, threadBackendGateway }) {
        this.slackGateway = slackGateway
        this.taskBackendGateway = taskBackendGateway
        this.threadBackendGateway = threadBackendGateway
    }

    /**
     * 「タスク新規入力」を開始するユースケース
     */
    async execute({ userId, triggerId }) {
        const date = getDate('YYYY-MM-DD')

        // スレッド存在チェック
        const thread = await this.threadBackendGateway.getThread({ userId, date });
        if (!thread) {
            return null
        }
        
        const serial = await this.taskBackendGateway.issueLatestSerial({ userId: userId, date: date })

        // BlockKit作成
        const params = {
            userId: userId,
            threadTs: thread.threadTs,
            date: date,
            serial: serial,
            status: TaskConst.STATUS.ACTIVE,
        }
        const modalView = TaskInputModal(params)

        // モーダルを開く
        await this.slackGateway.openModal({
            triggerId,
            view: modalView,
        })
    }
}

module.exports = { StartTaskInputUseCase }