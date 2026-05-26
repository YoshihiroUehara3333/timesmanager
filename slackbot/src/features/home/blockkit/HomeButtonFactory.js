// src/features/home/blockkit/HomeButtonFactory.js

const { ModalConst } = require('../../../shared/constants/ModalConst')

exports.HomeButtonFactory = Object.freeze({
  toDailyreport: () => ({
    text: '日報編集',
    value: 'home_dailyreport',
    actionId: ModalConst.ACTION_ID.HOME.DAILYREPORT,
  }),
  toAttendance: () => ({
    text: '勤怠入力',
    value: 'home_attendance',
    actionId: ModalConst.ACTION_ID.HOME.ATTENDANCE,
  }),
  toCreateTask: () => ({
    text: 'タスク新規作成',
    value: 'create_task',
    actionId: ModalConst.ACTION_ID.HOME.TASK_INPUT,
  }),
  toTaskEdit: (taskId) => ({
    actionId: ModalConst.ACTION_ID.TASK.UPDATE,
    text: '編集',
    value: taskId,
  })
})
