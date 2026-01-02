// src/features/task/blockkit/TaskBlockButtonFactory.js

const { ModalConst } = require('../../../shared/constants/ModalConst')

exports.TaskBlockButtonFactory = Object.freeze({
  toUpdateTask: (value) => ({
    text: '更新',
    value: value,
    actionId: ModalConst.ACTION_ID.TASK.UPDATE,
  }),
  toFinishTask: (value) => ({
    text: '完了',
    value: value,
    actionId: ModalConst.ACTION_ID.TASK.FINISH,
  }),
})
