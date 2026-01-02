// src/features/task/blockkit/TaskBlock.js

const { TaskBlockButtonFactory } = require('./TaskBlockButtonFactory')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Sections } = require('../../../shared/blockkit/components/Sections')

exports.TaskBlock = ({ userId, taskName, targetTime, memo, serial }) => ([
  Sections.mrkdwn(`<@${userId}>\n📝*タスク記録*`),
  Sections.multiMrkdwn([
    `*タスク名*\n${taskName}`,
    `*完了目標*\n${targetTime}`
  ]),
  Sections.mrkdwn(`*備考*\n${memo}`),
  {
    type: 'actions',
    elements: [
      Buttons.plainTextPrimaryButton(TaskBlockButtonFactory.toUpdateTask(serial)),
      Buttons.plainTextDangerButton(TaskBlockButtonFactory.toFinishTask(serial)),
    ]
  }
])
