// src/features/dailyreport/blockkit/DailyReportInputModal.js

const { ModalConst } = require('../../../shared/constants/ModalConst')

const { divider } = require('../../../shared/blockkit/components/Divider')

const { Buttons } = require('../../../shared/blockkit/components/Buttons')
const { Sections } = require('../../../shared/blockkit/components/Sections')
const { Input } = require('../../../shared/blockkit/components/Input')

exports.DailyReportInputModal = ({ userId, dailyreport = {} }) => ({
  type: 'modal',
  callback_id: ModalConst.CALLBACK_ID.DAILYREPORT_INPUT,
  private_metadata: JSON.stringify({
    user_id: userId,
  }),
  title: {
    type: 'plain_text',
    text: '日報入力',
    emoji: true
  },
  ...Buttons.modalButtons(),
  blocks: [
    Sections.mrkdwn('*本日の日報入力*'),
    divider(),
    Input.plainTextInput({
      blockId: 'task',
      labelText: '作業内容',
      actionId: 'task',
      multiline: true,
      initialValue: dailyreport.task || undefined,
      optional: true,
    }),
    Input.plainTextInput({
      blockId: 'impressions',
      labelText: '所感',
      actionId: 'impressions',
      multiline: true,
      initialValue: dailyreport.impressions || undefined,
      optional: true,
    }),
  ]
})
