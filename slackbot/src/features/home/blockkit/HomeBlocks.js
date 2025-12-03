// src/features/home/blockkit/HomeBlocks.js

const { ModalConst } = require('../../../shared/constants/ModalConst')
const { divider } = require('../../../shared/blockkit/components/Divider')
const { mrkdwnSection } = require('../../../shared/blockkit/components/Sections')

function dailyReportSection () {
  return [
    mrkdwnSection('*勤怠/日報管理*'),
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: '日報編集' },
          style: 'primary',
          value: 'home_dailyreport',
          action_id: ModalConst.ACTION_ID.HOME.DAILYREPORT,
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: '勤怠入力' },
          style: 'primary',
          value: 'home_attendance',
          action_id: ModalConst.ACTION_ID.HOME.ATTENDANCE,
        }
      ]
    }
  ]
}

function taskSection (thread) {
  const blocks = [
    mrkdwnSection('*タスク管理*'),
  ]

  if (thread) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'タスク新規作成' },
          style: 'primary',
          value: 'create_task',
          action_id: ModalConst.ACTION_ID.TASK.CREATE,
        }
      ]
    })
    blocks.push(mrkdwnSection('*タスク一覧*'))
  } else {
    blocks.push(mrkdwnSection('_本日のスレッドが未作成です_'))
  }

  return blocks
}

function taskList (
  { tasks = [] } = {}
) {
  if (!tasks.length) {
    return [
      mrkdwnSection('_現在表示できるタスクはありません_'),
    ]
  }

  return tasks.map((task) => (
    {
      ...mrkdwnSection(task.name),
      accessory: {
        type: 'button',
        action_id: ModalConst.ACTION_ID.TASK.UPDATE,
        text: {
          type: 'plain_text',
          text: 'Edit',
          emoji: true
        },
        value: task.name
      }
    }
  ))
}

exports.HomeBlocks = ({ tasks = [], thread = undefined }) => {
  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'timesmanager' }
    },
    divider(),
    ...dailyReportSection(),
    divider(),
    ...taskSection(thread),
  ]

  if (thread) {
    blocks.push(...taskList({ tasks }))
  }

  return {
    type: 'home',
    blocks,
  }
}
