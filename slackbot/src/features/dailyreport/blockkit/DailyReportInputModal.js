const { ModalConst } = require('../constants/ModalConst')

exports.DailyReportInputModal = ({ userId }) => ({
  type: 'modal',
  callback_id: ModalConst.CALLBACK_ID.DAILYREPORT,
  private_metadata: JSON.stringify({
    user_id: userId,
  }),
  title: {
    type: 'plain_text',
    text: '日報入力',
    emoji: true
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
    emoji: true
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true
  },
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*本日の日報編集*'
      }
    },
    { type: 'divider' },
    {
      type: 'input',
      block_id: 'task',
      label: {
        type: 'plain_text',
        text: '作業内容'
      },
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'input'
      }
    },
    {
      type: 'input',
      block_id: 'taskname',
      label: {
        type: 'plain_text',
        text: '所感'
      },
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'input'
      }
    }
  ]
})
