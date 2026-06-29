// src/shared/constants/BackendRouting.js

const API_BASE = '/api'

exports.BackendRouting = Object.freeze({
  THREAD: {
    POST: () => ({ method: 'POST', path: `${API_BASE}/thread` }),
    GETALL: () => ({ method: 'GET', path: `${API_BASE}/thread` }),
    GETBYDATE: (date) => ({ method: 'GET', path: `${API_BASE}/thread/${date}` }),
  },
  TASK: {
    GETALL: () => ({ method: 'GET', path: `${API_BASE}/task` }),
    CREATE: () => ({ method: 'POST', path: `${API_BASE}/task` }),
    SAVE: () => ({ method: 'PUT', path: `${API_BASE}/task` }),
  },
  DAILYREPORT: {
    GETBYDATE: (date) => ({ method: 'GET', path: `${API_BASE}/dailyreport/${date}` }),
    SAVE: () => ({ method: 'PUT', path: `${API_BASE}/dailyreport` }),
  },
  ATTENDANCE: {
    SAVE: () => ({ method: 'PUT', path: `${API_BASE}/attendance` }),
    GETBYDATE: (date) => ({ method: 'GET', path: `${API_BASE}/attendance/${date}` }),
  },
  HOME: {
    GET: () => ({ method: 'GET', path: `${API_BASE}/dailycontext/home` }),
  }
})
