// src/shared/blockkit/components/Text.js

function plainTextObject ({ text, emoji = true }) {
  return { type: 'plain_text', text, emoji }
}

function mrkdwnTextObject ({ text }) {
  return { type: 'plain_text', text }
}

module.exports = {
  plainTextObject,
  mrkdwnTextObject,
}
