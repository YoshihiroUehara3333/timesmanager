// src/shared/blockkit/components/Sections.js

const { plainTextObject, mrkdwnTextObject } = require('./TextObjects')

function mrkdwn (
  text = 'デフォルトテキスト',
) {
  return {
    type: 'section',
    text: mrkdwnTextObject(text)
  }
}

function multiMrkdwn (texts = []) {
  return {
    type: 'section',
    fields: texts.map((t) => mrkdwnTextObject(t))
  }
}

function plainText ({ text, emoji = true }) {
  return { type: 'section', text: plainTextObject(text, emoji) }
}

module.exports = {
  Sections: {
    mrkdwn,
    multiMrkdwn,
    plainText,
  }
}
