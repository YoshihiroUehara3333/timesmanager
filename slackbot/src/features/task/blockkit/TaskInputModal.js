// src/features/task/blockkit/TaskInputModal.js

const { ModalConst } = require('../../../shared/constants/ModalConst')

const { divider } = require('../../../shared/blockkit/components/Divider')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Input } = require('../../../shared/blockkit/components/Input')

exports.TaskInputModal = ({ channelId, threadTs, date, serial, userId, status }) => ({
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'タスク入力'
  },
  callback_id: ModalConst.CALLBACK_ID.TASK_INPUT,
  private_metadata: JSON.stringify({
    channelId: channelId,
    threadTs: threadTs,
    userId: userId,
    date: date,
    serial: serial,
    status: status,
  }),
  ...Buttons.modalButtons(),
  blocks: [
    Input.plainTextInput({
      blockId: 'taskName',
      labelText: 'タスク名',
      actionId: 'input',
    }),
    Input.timePicker({
      blockId: 'targetTime',
      labelText: '完了目標',
      placeholderText: '完了目標を選択',
      initialTime: '10:00',
      actionId: 'targetTime',
    }),
    divider(),
    Input.plainTextInput({
      blockId: 'memo',
      labelText: '所感など',
      actionId: 'memo',
      multiline: true,
      optional: true,
    }),
  ]
})
