// src/shared/blockkit/components/Input.js

const { plainTextObject } = require('./Text')

function timePicker ({
  blockId,
  labelText,
  placeholderText,
  initialTime,
  actionId
}) {
  return {
    type: 'input',
    block_id: blockId,
    label: plainTextObject(labelText),
    element: {
      type: 'timepicker',
      initial_time: initialTime,
      placeholder: plainTextObject(placeholderText),
      action_id: actionId
    }
  }
}

function staticSelect ({
  blockId,
  options,
  initialOption,
  labelText,
  placeholderText = '選択してください',
  actionId,
}) {
  return {
    type: 'input',
    block_id: blockId,
    label: plainTextObject(labelText),
    element: {
      type: 'static_select',
      placeholder: plainTextObject(placeholderText),
      action_id: actionId,
      options: options,
      ...(initialOption ? { initial_option: initialOption } : {}),
    }
  }
}

module.exports = {
  Input: {
    timePicker,
    staticSelect,
  }
}
