// src/core/logging/Logger.js

const { getRequestContext } = require('./RequestContext')

const write = (level, message, fields = {}) => {
  const record = {
    ...fields,
    ...getRequestContext(),
    timestamp: new Date().toISOString(),
    level,
    message,
  }

  console[level](JSON.stringify(record))
}

const logger = {
  info: (message, fields) => write('info', message, fields),
  warn: (message, fields) => write('warn', message, fields),
  error: (message, error, fields = {}) => write('error', message, {
    ...fields,
    error: {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    },
  }),
}

module.exports = { logger }
