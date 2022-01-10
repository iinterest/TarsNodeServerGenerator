const debug = require('debug')('NodeServerBoilerPlate:app')
const Tars = require('@tars/rpc')
const configLoader = require('./lib/configLoader')
const logger = require('./lib/logger')
const ErrListener = require('./lib/error')
const NodeServerBoilerPlate = require('./tars/NodeServerBoilerPlateImp').NodeServerBoilerAppName
ErrListener.listen()
process.env.TZ = process.env.npm_package_config_TZ || 'Asia/Shanghai'

function startServer() {
    configLoader('NodeServerBoilerPlate.conf', 'c').then(configData => {
        global.CONFIG = configData
        const svr = new Tars.server()
        svr.initialize(process.env.TARS_CONFIG || './server.conf', function (server) {
            let serverInfo
            Object.keys(server._configure.data.tars.application.server).map(key => {
                if (key.indexOf('ObjAdapter') !== -1) {
                    serverInfo = server._configure.data.tars.application.server[key]
                }
            })
            console.log('=====================================================================')
            console.log('server startup:', `${serverInfo.servant}@${serverInfo.endpoint}`)
            console.log('configData', configData)
            server.addServant(NodeServerBoilerPlate.NodeServerBoilerPlateImp, server.Application + '.' + server.ServerName + '.NodeServerBoilerObjName')
            logger.server.info('server startup successful')
            console.log('=====================================================================')
        })
        svr.start()
    }).catch(err => {
        logger.server.info('server startup Error', err.stack)
    })
}

startServer()