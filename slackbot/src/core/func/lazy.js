// src/core/func/lazy.js

const lazy = (operation) => {
  let instance

  return () => {
    instance ??= operation()
    return instance
  }
}

module.exports = { lazy }