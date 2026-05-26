// src/features/task/blockkit/TaskBlock.js

const { TaskBlockButtonFactory } = require('./TaskBlockButtonFactory')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Sections } = require('../../../shared/blockkit/components/Sections')

exports.TaskBlock = ({ userId, serial, date, taskName, targetTime, memo }) => ([
  Sections.mrkdwn({ text: `<@${userId}>\n📝*タスク記録*` }),
  Sections.plainText({ text: `*タスク名*\n${taskName}` }),
  // 進捗記録ここに入れる
  Sections.mrkdwn(`*メモ*\n${memo}`),
  {
    type: 'actions',
    elements: [
      Buttons.plainTextPrimaryButton(TaskBlockButtonFactory.toUpdateTask(serial)),
      Buttons.plainTextDangerButton(TaskBlockButtonFactory.toFinishTask(serial)),
    ]
  }
])
