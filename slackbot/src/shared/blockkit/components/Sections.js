// src/shared/blockkit/components/Sections.js

function mrkdwnSection (
  text = 'デフォルトテキスト',
) {
  return {
    type: 'section',
    text: { type: 'mrkdwn', text: text }
  }
}

module.exports = {
  mrkdwnSection,
}
