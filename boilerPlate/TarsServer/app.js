const debug = require('debug')('NodeServerBoilerPlate:app')
const Tars = require('@tars/rpc')
const configLoader = require('./lib/configLoader')
const logger = require('./lib/logger')
const ErrListener = require('./lib/error')
const NodeServerBoilerPlate = require('./tars/NodeServerBoilerPlateImp').NodeServerBoilerAppName
ErrListener.listen()

function startServer() {
    configLoader('NodeServerBoilerPlate.conf', 'c').then(configData => {
        global.CONFIG = configData
        debug('configData', configData)
        const svr = new Tars.server()
        svr.initialize(process.env.TARS_CONFIG || './server.conf', function (server) {
            debug('server', server)
            server.addServant(NodeServerBoilerPlate.NodeServerBoilerPlateImp, server.Application + '.' + server.ServerName + '.NodeServerBoilerObjName')
            logger.server.info('server startup successful...')
        })
        svr.start()
    }).catch(err => {
        logger.server.info('server startup Error', err)
    })
}

startServer()