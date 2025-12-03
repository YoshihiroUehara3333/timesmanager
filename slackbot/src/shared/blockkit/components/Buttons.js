// src/shared/blockkit/components/Buttons.js

// plain_text オブジェクトを作る小さいヘルパー
const plainText = (text) => ({
  type: 'plain_text',
  text,
});

// モーダルの submit/close セットをまとめて作る
function modalButtons({
  submitText = '送信',
  closeText = 'キャンセル',
} = {}) {
  return {
    submit: plainText(submitText),
    close: plainText(closeText),
  };
}

function modalSubmit(text = '送信') {
  return plainText(text);
}

function modalClose(text = 'キャンセル') {
  return plainText(text);
}

module.exports = {
  modalButtons,
  modalSubmit,
  modalClose,
}
