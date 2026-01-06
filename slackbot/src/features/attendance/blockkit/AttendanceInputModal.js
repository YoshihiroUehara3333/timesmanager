// src/features/attendance/blockkit/AttendanceInputModal.js

const { ModalConst } = require('../../../shared/constants/ModalConst')
const { WorkplaceConst } = require('../../../shared/constants/WorkplaceConst')

const { plainTextObject } = require('../../../shared/blockkit/components/TextObjects')
const { divider } = require('../../../shared/blockkit/components/Divider')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Sections } = require('../../../shared/blockkit/components/Sections')
const { Input } = require('../../../shared/blockkit/components/Input')

function workplaceSection (attendance = {}) {
  const options = WorkplaceConst.LIST.map(option => (
    {
      text: plainTextObject({ text: String(option.text) }),
      value: option.value,
    }
  ))
  const initial = options.find(o => o.value === attendance.workplace)

  return Input.staticSelect({
    blockId: 'workplace',
    options: options,
    initialOption: initial,
    labelText: '作業場所',
    actionId: 'select_workplace',
  })
}

function workingTimeSection ({ attendance }) {
  return [
    Input.timePicker({
      blockId: 'starttime',
      labelText: '開始時間',
      placeholderText: '開始時間を選択',
      initialTime: attendance.startTime || '09:00',
      actionId: 'start_time',
    }),
    Input.timePicker({
      blockId: 'endtime',
      labelText: '終了時間',
      placeholderText: '終了時間を選択',
      initialTime: attendance.endTime || '18:00',
      actionId: 'end_time',
    }),
  ]
}

exports.AttendanceInputModal = ({ userId, date, attendance = {} }) => ({
  type: 'modal',
  callback_id: ModalConst.CALLBACK_ID.ATTENDANCE_INPUT,
  private_metadata: JSON.stringify({
    user_id: userId,
    date: date,
  }),
  title: { type: 'plain_text', text: '勤怠記録', emoji: true },
  ...Buttons.modalButtons(),
  blocks: [
    Sections.mrkdwn('*本日の勤怠状況を入力してください*'),
    divider(),
    ...workingTimeSection({ attendance }),
    workplaceSection(attendance),
  ]
})
