// src/shared/blockkit/components/Input.js

const { plainTextObject } = require('./TextObjects')
const { Element } = require('./Element')

function datePicker ({
  blockId,
  labelText,
  optional = false,
  placeholderText,
  date,
  actionId,
}) {
  return {
    type: 'input',
    block_id: blockId,
    optional: optional,
    label: plainTextObject({ text: labelText }),
    element: Element.datePicker({
      placeholderText,
      date,
      actionId,
    })
  }
}

function timePicker ({
  blockId,
  labelText,
  optional = false,
  placeholderText,
  initialTime,
  actionId,
}) {
  return {
    type: 'input',
    block_id: blockId,
    optional: optional,
    label: plainTextObject({ text: labelText }),
    element: Element.timePicker({
      placeholderText,
      initialTime,
      actionId,
    })
  }
}

function staticSelect ({
  blockId,
  labelText,
  optional = false,
  options,
  initialOption,
  placeholderText = '選択してください',
  actionId,
}) {
  return {
    type: 'input',
    block_id: blockId,
    label: plainTextObject({ text: labelText }),
    optional: optional,
    element: Element.staticSelect({
      options,
      initialOption,
      placeholderText,
      actionId,
    })
  }
}

function plainTextInput ({
  blockId,
  labelText,
  optional = false,
  actionId,
  multiline = false,
  initialValue,
}) {
  return {
    type: 'input',
    block_id: blockId,
    label: plainTextObject({ text: labelText }),
    optional: optional,
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
    datePicker,
    timePicker,
    staticSelect,
    plainTextInput,
  }
}
