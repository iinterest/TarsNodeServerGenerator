const fs = require('fs')
const tarsConfig = require('@tars/config')
const tarsUtils = require('@tars/utils')

const configLoader = (filename, configFormat) => {
    return new Promise((resolve, reject) => {
        if (process.env.TARS_CONFIG) {
            if (configFormat === 'c') {
                configFormat = { format: 'C' }
            }
            let configHelper = new tarsConfig()
            configHelper.loadConfig(filename, configFormat).then(data => {
                let iData = parseConfig(data, configFormat)
                global.CONFIG = iData
                resolve(iData)
            }, function (err) {
                reject('configLoader: file error')
            })
        } else {
            fs.readFile(filename, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    let iData = parseConfig(data, configFormat)
                    global.CONFIG = iData
                    resolve(iData)
                }
            })
        }
    })
}

const parseConfig = (content, configFormat) => {
    let ret = content
    if (configFormat === 'c') {
        let config = new tarsUtils.Config()
        config.parseText(content)
        ret = config.data
    } else if (configFormat === 'json') {
        ret = JSON.parse(content)
    }
    return ret
}

module.exports = configLoader