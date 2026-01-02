// src/shared/blockkit/components/Text.js

function plainTextObject ({ text, emoji = true }) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error(`[plainTextObject] text is required. text: ${JSON.stringify(text)}`)
  }

  return {
    type: 'plain_text',
    text: text,
    emoji: emoji,
  }
}

function mrkdwnTextObject ({ text }) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error(`[mrkdwnTextObject] text is required. text: ${JSON.stringify(text)}`)
  }

  return {
    type: 'plain_text',
    text: text,
  }
}

module.exports = {
  plainTextObject,
  mrkdwnTextObject,
}
