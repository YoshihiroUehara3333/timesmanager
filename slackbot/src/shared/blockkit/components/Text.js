// src/shared/blockkit/components/Text.js

function plainTextObject ({ text, emoji = true }) {
  return { type: 'plain_text', text, emoji }
}

module.exports = {
  Text: {
    plainTextObject,
  }
}
