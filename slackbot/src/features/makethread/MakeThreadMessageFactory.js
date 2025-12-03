// src/features/makethread/MakeThreadMessageFactory.js

function buildThreadInitialText({ userId, text }) {
  // ここに、「タスクスレッドのテンプレ」を集中させる
  const header = `<@${userId}> \n*【壁】${date}*`
  return header
}

function buildReplyText({ permalink }) {
  return `スレッド作成済\n${permalink}`
}

module.exports = {
  buildThreadInitialText,
  buildReplyText,
}