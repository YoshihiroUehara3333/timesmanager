// src/features/task/blockkit/TaskBlock.js

const { TaskBlockButtonFactory } = require('./TaskBlockButtonFactory')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Sections } = require('../../../shared/blockkit/components/Sections')

exports.TaskBlock = ({ userId, serial, date, taskName, targetTime, memo, status }) => ([
  Sections.mrkdwn({ text: `<@${userId}>\n📝*タスク記録*` }),
  Sections.multiMrkdwn({
    texts: [
      `*タスク名*\n${taskName}`,
      `*完了目標*\n${targetTime}`
    ]
  }),
  Sections.mrkdwn(`*メモ*\n${memo}`),
  {
    type: 'actions',
    elements: [
      Buttons.plainTextPrimaryButton(TaskBlockButtonFactory.toUpdateTask({ serial, userId, date })),
      Buttons.plainTextDangerButton(TaskBlockButtonFactory.toFinishTask(serial)),
    ]
  }
])
