// src/core/logging/RequestContext.js

const { AsyncLocalStorage } = require('node:async_hooks')

const storage = new AsyncLocalStorage()

const withRequestContext = (context, operation) => {
  return storage.run(context, operation)
}

const getRequestContext = () => storage.getStore() ?? {}

module.exports = { withRequestContext, getRequestContext }
