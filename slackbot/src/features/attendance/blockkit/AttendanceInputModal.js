// src/features/attendance/blockkit/AttendanceInputModal.js

const { ModalConst } = require('../constants/ModalConst')
const { modalButtons } = require('../../../shared/blockkit/components/Buttons')
const { divider } = require('../../../shared/blockkit/components/Divider')
const { mrkdwnSection } = require('../../../shared/blockkit/components/Sections')

const workplaceOptions = {
  LIST: [
    {
      value: 'onsite',
      text: '出社',
    },
    {
      value: 'remote',
      text: 'リモート',
    },
    {
      value: 'office',
      text: '自社',
    },
    {
      value: 'vacation',
      text: '休暇',
    },
  ],
  getTextByValue (value) {
    const item = this.LIST.find(i => i.value === value)
    return item ? item.text : 'その他'
  },

  getValueByText (text) {
    const item = this.LIST.find(i => i.text === text)
    return item ? item.value : 'other'
  }
}

function workplaceSection (attendance = {}) {
  const element = {
    type: 'static_select',
    placeholder: { type: 'plain_text', text: '選択してください', emoji: true },
    action_id: 'select_workplace',
  }

  element.options = workplaceOptions.LIST.map(option => (
    {
      text: { type: 'plain_text', text: option.text, emoji: true },
      value: option.value,
    }
  ))

  if (attendance.workplace) {
    element.initial_option = {
      text: {
        type: 'plain_text',
        text: workplaceOptions.getTextByValue(attendance.workplace),
        emoji: true
      },
      value: attendance.workplace
    }
  }

  return {
    type: 'input',
    block_id: 'workplace',
    label: {
      type: 'plain_text',
      text: '作業場所'
    },
    element: element,
  }
}

exports.AttendanceInputModal = ({ userId, date, attendance = {} }) => ({
  type: 'modal',
  callback_id: ModalConst.CALLBACK_ID.ATTENDANCE_INPUT,
  private_metadata: JSON.stringify({
    user_id: userId,
    date: date,
  }),
  title: { type: 'plain_text', text: '勤怠記録', emoji: true },
  ...modalButtons(),
  blocks: [
    ...mrkdwnSection('*本日の勤怠状況を入力してください*'),
    ...divider(),
    {
      type: 'input',
      block_id: 'starttime',
      label: {
        type: 'plain_text',
        text: '開始時間'
      },
      element: {
        type: 'timepicker',
        initial_time: attendance.startTime || '09:00',
        placeholder: {
          type: 'plain_text',
          text: '開始時間を選択'
        },
        action_id: 'start_time'
      }
    },
    {
      type: 'input',
      block_id: 'endtime',
      label: {
        type: 'plain_text',
        text: '終了時間'
      },
      element: {
        type: 'timepicker',
        initial_time: attendance.endTime || '18:00',
        placeholder: {
          type: 'plain_text',
          text: '終了時間を選択'
        },
        action_id: 'end_time'
      }
    },
    workplaceSection(attendance),
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'フィードバックを送信',
            emoji: true
          },
          value: 'send_feedback',
          action_id: 'send_feedback'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'よくある質問',
            emoji: true
          },
          value: 'show_faq',
          action_id: 'show_faq'
        }
      ]
    }
  ]
})
