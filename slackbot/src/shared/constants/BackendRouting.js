// src/shared/constants/BackendRouting.js

const API_BASE = '/api'

exports.BackendRouting = Object.freeze({
  THREAD: {
    CREATE: () => ({ method: 'POST', path: `${API_BASE}/thread` }),
    GETALL: () => ({ method: 'GET', path: `${API_BASE}/thread` }),
    GETBYDATE: (date) => ({ method: 'GET', path: `${API_BASE}/thread/${date}` }),
  },
  TASK: {
    GETALL: () => ({ method: 'GET', path: `${API_BASE}/task` }),
    CREATE: () => ({ method: 'POST', path: `${API_BASE}/task` }),
    SAVE: () => ({ method: 'PUT', path: `${API_BASE}/task` }),
    SERIAL: () => ({ method: 'GET', path: `${API_BASE}/task/serial` }),
  },
  DAILYREPORT: {
    GETBYDATE: (date) => ({ method: 'GET', path: `${API_BASE}/dailyreport/${date}` }),
    SAVE: (date) => ({ method: 'PUT', path: `${API_BASE}/dailyreport${date}` }),
  },
  ATTENDANCE: {
    SAVE: (date) => ({ method: 'PUT', path: `${API_BASE}/attendance/${date}` }),
    GETBYDATE: (date) => ({ method: 'GET', path: `${API_BASE}/attendance${date}` }),
  }
})
