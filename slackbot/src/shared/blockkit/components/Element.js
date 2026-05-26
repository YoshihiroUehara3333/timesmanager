// src/shared/blockkit/components/Element.js

const { plainTextObject } = require('./TextObjects')

function datePicker ({
  placeholderText = '日付を選択してください',
  date = '2026-01-01',
  actionId = 'datepicker-action',
}) {
  return {
    type: 'datepicker',
    initial_date: date,
    placeholder: plainTextObject({ text: String(placeholderText) }),
    action_id: actionId,
  }
}

function timePicker ({
  placeholderText,
  initialTime = '09:00',
  actionId,
}) {
  return {
    type: 'timepicker',
    initial_time: initialTime,
    placeholder: plainTextObject({ text: String(placeholderText) }),
    action_id: actionId,
  }
}

function staticSelect ({
  options,
  initialOption,
  placeholderText = '選択してください',
  actionId,
}) {
  return {
    type: 'static_select',
    placeholder: plainTextObject({ text: String(placeholderText) }),
    action_id: actionId,
    options: options,
    ...(initialOption ? { initial_option: initialOption } : {}),
  }
}

function plainTextInput ({
  actionId,
  multiline = false,
  initialValue,
}) {
  return {
    type: 'plain_text_input',
    action_id: actionId,
    multiline: multiline,
    ...(initialValue !== undefined ? { initial_value: initialValue } : {}),
  }
}

module.exports = {
  Element: {
    timePicker,
    datePicker,
    staticSelect,
    plainTextInput,
  }
}
