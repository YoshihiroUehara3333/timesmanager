// src/feates/task/blockkit/TaskBlockButtonFactory.js

const { ModalConst } = require('../../../shared/constants/ModalConst')

exports.TaskBlockButtonFactory = Object.freeze({
  toUpdateMemo: (value) => ({
    text: 'メモ更新',
    value: value,
    actionId: ModalConst.ACTION_ID.TASK.UPDATE,
  }),
  toAddProgression: (value) => ({
    text: '進捗記録',
    value: value,
    actionId: ModalConst.ACTION_ID.TASK.FINISH,
  }),
})
