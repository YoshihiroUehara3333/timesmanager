// src/features/task/blockkit/TaskBlock.js

const { ModalConst } = require('../../../shared/constants/ModalConst')
const { mrkdwnSection } = require('../../../shared/blockkit/components/Sections')

exports.TaskBlock = ({ userId, taskName, targetTime, memo, serial }) => ([
  mrkdwnSection(`<@${userId}>\n📝*タスク記録*`),
  {
    type: 'section',
    fields: [
      {
        type: 'mrkdwn',
        text: `*タスク名*\n${taskName}`
      },
      {
        type: 'mrkdwn',
        text: `*完了目標*\n${targetTime}`
      },
      {
        type: 'mrkdwn',
        text: `*備考*\n${memo}`
      },
    ]
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: '更新'
        },
        style: 'primary',
        value: serial,
        action_id: ModalConst.ACTION_ID.TASK.UPDATE,
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: '完了'
        },
        style: 'danger',
        value: serial,
        action_id: ModalConst.ACTION_ID.TASK.FINISH,
      }
    ]
  }
])
