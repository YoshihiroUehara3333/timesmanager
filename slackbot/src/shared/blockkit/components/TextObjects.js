// src/shared/blockkit/components/Text.js

function plainTextObject ({ text, emoji = true }) {
  return {
    type: 'plain_text',
    text: text,
    emoji: emoji,
  }
}

function mrkdwnTextObject ({ text }) {
  return {
    type: 'plain_text',
    text: text,
  }
}

module.exports = {
  plainTextObject,
  mrkdwnTextObject,
}
