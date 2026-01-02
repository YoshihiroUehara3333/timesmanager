// src/shared/constants/BackendRouting.js

const API_BASE = '/api'

exports.BackendRouting = Object.freeze({
  THREAD: {
    CREATE: { method: 'PUT', path: `${API_BASE}/thread` },
    GET: { method: 'GET', path: `${API_BASE}/thread` },
  },
  TASK: {
    GET: { method: 'GET', path: `${API_BASE}/task` },
    SERIAL: { method: 'GET', path: `${API_BASE}/task/serial` },
    SAVE: { method: 'PUT', path: `${API_BASE}/task` },
  },
  DAILYREPORT: {
    GET: { method: 'GET', path: `${API_BASE}/dailyreport` },
    SAVE: { method: 'POST', path: `${API_BASE}/dailyreport` },
  },
  ATTENDANCE: {
    SAVE: { method: 'POST', path: `${API_BASE}/attendance` },
    GET: { method: 'GET', path: `${API_BASE}/attendance` },
  }
})
