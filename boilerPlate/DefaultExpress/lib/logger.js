const tarsLogs = require('@tars/logs');

let logger = {};
logger.error =  new tarsLogs('TarsDate', 'error');
logger.accessLog =  new tarsLogs('TarsDate', 'accessLog');

// logger.info([data], [...]);
// logger.debug([data], [...]);
// logger.warn([data], [...]);
// logger.error([data], [...]);

module.exports = logger