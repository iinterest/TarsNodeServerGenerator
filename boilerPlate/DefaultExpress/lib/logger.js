const tarsLogs = require('@tars/logs')

let logger = {}
logger.error =  new tarsLogs('TarsDate', 'error')
logger.accessLog =  new tarsLogs('TarsDate', 'accessLog')

module.exports = logger