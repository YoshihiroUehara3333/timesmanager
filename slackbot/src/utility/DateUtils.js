// src/utility/DateUtils.js

require('date-utils')

function getDate(format) {
    return new Date().toFormat(format)
}

module.exports = { getDate }