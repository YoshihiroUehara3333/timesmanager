// src/features/home/blockkit/HomeBlocks.js

const { HomeButtonFactory } = require('./HomeButtonFactory')

const { divider } = require('../../../shared/blockkit/components/Divider')
const { Sections } = require('../../../shared/blockkit/components/Sections')
const { Buttons } = require('../../../shared/blockkit/components/Buttons')

const MAX_TASKS_TO_SHOW = 30

function dailyReportSection () {
  return [
    Sections.mrkdwn('*勤怠/日報管理*'),
    {
      type: 'actions',
      elements: [
        Buttons.plainTextPrimaryButton(HomeButtonFactory.toDailyreport()),
        Buttons.plainTextPrimaryButton(HomeButtonFactory.toAttendance()),
      ]
    }
  ]
}

function taskSection (thread) {
  const blocks = [
    Sections.mrkdwn('*タスク管理*'),
  ]

  if (thread) {
    blocks.push({
      type: 'actions',
      elements: [
        Buttons.plainTextPrimaryButton(HomeButtonFactory.toCreateTask()),
      ]
    })
    blocks.push(Sections.mrkdwn('*タスク一覧*'))
  } else {
    blocks.push(Sections.mrkdwn('_本日のスレッドが未作成です_'))
  }

  return blocks
}

function taskList (
  { tasks = [] }
) {
  if (!tasks.length) {
    return [
      Sections.mrkdwn('_現在表示できるタスクはありません_'),
    ]
  }

  return tasks.map((task) => (
    {
      ...Sections.mrkdwn(task.name),
      accessory: Buttons.plainTextPrimaryButton(HomeButtonFactory.toTaskEdit(task.taskId)),
    }
  ))
}

exports.HomeBlocks = ({ tasks = [], thread }) => {
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
    const visible = tasks.slice(0, MAX_TASKS_TO_SHOW)
    blocks.push(...taskList({ tasks: visible }))

    if (tasks.length > MAX_TASKS_TO_SHOW) {
      blocks.push(Sections.mrkdwn(`_他 ${tasks.length - MAX_TASKS_TO_SHOW} 件は省略されています_`))
    }
  }

  return {
    type: 'home',
    blocks,
  }
}
