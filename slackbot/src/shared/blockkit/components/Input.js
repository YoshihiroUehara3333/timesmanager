// src/shared/blockkit/components/Input.js

const { plainTextObject } = require('./TextObjects')

function timePicker ({
  blockId,
  labelText,
  placeholderText,
  initialTime,
  actionId,
  optional = false,
}) {
  return {
    type: 'input',
    block_id: blockId,
    optional: optional,
    label: plainTextObject({ text: labelText }),
    element: {
      type: 'timepicker',
      initial_time: initialTime,
      placeholder: plainTextObject({ text: placeholderText }),
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
    label: plainTextObject({ text: labelText }),
    element: {
      type: 'static_select',
      placeholder: plainTextObject({ text: placeholderText }),
      action_id: actionId,
      options: options,
      ...(initialOption ? { initial_option: initialOption } : {}),
    }
  }
}

function plainTextInput ({
  blockId,
  labelText,
  actionId,
  multiline = false,
  initialValue,
  optional = false,
}) {
  return {
    type: 'input',
    block_id: blockId,
    optional: optional,
    label: plainTextObject({ text: labelText }),
    element: {
      type: 'plain_text_input',
      action_id: actionId,
      multiline: multiline,
      ...(initialValue !== undefined ? { initial_value: initialValue } : {}),
    }
  }
}

module.exports = {
  Input: {
    timePicker,
    staticSelect,
    plainTextInput,
  }
}
