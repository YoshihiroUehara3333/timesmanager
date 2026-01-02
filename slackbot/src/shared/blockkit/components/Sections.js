// src/shared/blockkit/components/Sections.js

const { plainTextObject } = require('./Text')

function mrkdwn (
  text = 'デフォルトテキスト',
) {
  return {
    type: 'section',
    text: { type: 'mrkdwn', text: text }
  }
}

function plainText ({ text, emoji = true }) {
  return { type: 'section', text: plainTextObject(text, emoji) }
}

module.exports = {
  Sections: {
    mrkdwn,
    plainText,
  }
}
