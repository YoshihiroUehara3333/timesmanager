// src/features/thread/blockkit/MakeThreadMessageFactory.js

function buildThreadInitialText ({ userId, date }) {
  const header = `<@${userId}> \n*【壁】${date}*`
  return header
}

function buildReplyText ({ permalink }) {
  return `スレッド作成済\n${permalink}`
}

module.exports = {
  buildThreadInitialText,
  buildReplyText,
}
