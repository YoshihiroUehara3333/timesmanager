// src/features/task/blockkit/TaskInputModal.js

const { ModalConst } = require('../../../shared/constants/ModalConst')

const { divider } = require('../../../shared/blockkit/components/Divider')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Input } = require('../../../shared/blockkit/components/Input')

exports.TaskInputModal = ({ channelId, threadTs, date, serial, userId }) => ({
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
  }),
  ...Buttons.modalButtons(),
  blocks: [
    Input.plainTextInput({
      blockId: 'taskName',
      labelText: 'タスク名',
      actionId: 'input',
    }),
    divider(),
    Input.plainTextInput({
      blockId: 'memo',
      labelText: 'メモ',
      actionId: 'memo',
      multiline: true,
      optional: true,
    }),
  ]
})
