// src/shared/blockkit/components/Buttons.js

const { plainTextObject } = require('./Text')

function modalButtons ({
  submitText = '送信',
  closeText = 'キャンセル',
} = {}) {
  return {
    submit: plainTextObject(submitText),
    close: plainTextObject(closeText),
  }
}

function plainTextPrimaryButton ({ text, value, actionId }) {
  return {
    type: 'button',
    text: plainTextObject(text),
    style: 'primary',
    value: value,
    action_id: actionId,
  }
}

module.exports = {
  Buttons: {
    modalButtons,
    plainTextPrimaryButton,
  }
}
