#!/usr/bin/env node
const program = require('commander')
const mkdirp = require('mkdirp')
const path = require('path')
const readline = require('readline')
const fs = require('fs-extra')
const pkg = require('../package.json')

const version = pkg.version
const _exit = process.exit
process.exit = exit

const boilerPlateConfig = {
    'DefaultExpress': {
        editFileList: [
            'TarsConfig.conf',
            'nodemon.json',
            'package.json',
            'server.js',
            'routes/home.js',
        ],
        copyList: [
            'lib/',
            'routes/',
            'views/',
            'app.js'
        ],
        emptyDir: [
            'public/',
            'test/',
        ]
    },
    'TsExpress': {

    },
    'TarsServer': {
        editFileList: [
            'TarsConfig.conf',
            'server.conf',
            'nodemon.json',
            'package.json',
            'app.js',
            'tars/demo.tars',
        ],
        copyList: [
            'lib/',
        ],
        emptyDir: [
            'proxy/',
            'tars/'
        ]
    }
}

program
    .version(version)
    .usage('<command> [options]')
    .option('-t, --tars <AppName>', '生成 TarsServer')

program
    .command('create <projectName>')
    .description('初始化一个 TarsNodeServer 工程')
    .action(main)

program
    .allowUnknownOption()
    .parse(process.argv)


function main(projectName, commandInfo) {
    emptyDirectory(projectName, function (empty) {
        if (empty || program.force) {
            createApplication(projectName)
        } else {
            confirm('目录已存在, 是否继续? [y/N] ', function (ok) {
                if (ok) {
                    process.stdin.destroy()
                    createApplication(projectName)
                } else {
                    console.error('已取消')
                    exit(1)
                }
            })
        }
    })
}

function createApplication(projectName) {
    
    console.log()
    console.log('tarsns %s 开始执行 ', version)
    console.log()
    console.log('1. 生成项目文件')

    let boilerPlateName = 'DefaultExpress'
    let appName
    let serverObjName
    
    if (program.ts) {
        boilerPlateName = 'TsExpress'
    }
    if (program.tars) {
        boilerPlateName = 'TarsServer'
        appName = program.tars
        serverObjName = projectName + 'Obj'
    }
    const boilerPlate = boilerPlateConfig[boilerPlateName]

    boilerPlate.copyList.forEach(async (item, index) => {
        let sourcePath = path.join(__dirname, '..', `boilerPlate/${boilerPlateName}/`, item)
        let destPath = `./${projectName}/${item}`
        if (sourcePath) {
            copyBoilerPlate(sourcePath, destPath, item)
        }
    })

    boilerPlate.emptyDir.forEach(async (item, index) => {
        let destPath = `./${projectName}/${item}`
        await fs.emptyDir(destPath)

        if (boilerPlate.emptyDir.length - index - 1 === 0) {
            doEditFileList()
        }
    })

    function doEditFileList() {
        boilerPlate.editFileList.forEach(item => {
            let sourcePath = path.join(__dirname, '..', `boilerPlate/${boilerPlateName}/`, item)
            let destPath = `./${projectName}/${item}`
            if (destPath.indexOf('TarsConfig.conf') !== -1) {
                destPath = `./${projectName}/${projectName}.conf`
            }
            if (destPath.indexOf('.tars') !== -1) {
                destPath = `./${projectName}/tars/${projectName}.tars`
            }
            try {
                let file = fs.readFileSync(sourcePath, 'utf-8')
                file = file.replace(/NodeServerBoilerPlate/ig, projectName).replace(/TafnsGeneratorVersion/ig, version)
                if (appName) {
                    file = file.replace(/NodeServerBoilerAppName/ig, appName).replace(/NodeServerBoilerObjName/ig, serverObjName)
                }
                writeFile(destPath, file)
            } catch (error) {
                console.log('editFile Error: ', error)
            }
        })
    }
    

    (async function() {
        const sourcePath = path.join(__dirname, '..', `boilerPlate/${boilerPlateName}/gitignore.txt`)
        const gitignoreData = await fs.readFile(sourcePath, 'utf8')
        const destPath = `./${projectName}/.gitignore`
        await fs.outputFile(destPath, gitignoreData)
    }())

    console.log('生成完成')
    console.log()
    console.log('2. 安装依赖:')
    console.log('npm install -g nodemon (如安装过请忽略)')
    switch(boilerPlateName) {
        case 'TsExpress':
            console.log('npm install -g typescript (如安装过请忽略)')
            console.log('cd %s && npm i', projectName)
            break
        default:
            console.log('cd %s && npm i', projectName)
    }
    console.log()
    console.log('3. 运行项目:')
    switch(boilerPlateName) {
        case 'TsExpress':
            console.log('tsc -w')
            console.log('npm start')
            break
        case 'TarsServer': 
            console.log(`cd tars && tars2node ${projectName}.tars && tars2node ${projectName}.tars --server` )
            console.log('cd ../ && npm start')
            break
        default:
            console.log('npm start')
    }
    console.log()
}

function copyBoilerPlate(sourcePath, dest, pathName) {
    try {
        fs.copySync(sourcePath, dest)
        // console.log('   \x1b[36mcreate\x1b[0m : ' + pathName)
    } catch (err) {
        console.error(err)
    }
}

function confirm(msg, callback) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question(msg, function (input) {
        rl.close()
        callback(/^y|yes|ok|true$/i.test(input))
    })
}

/**
 * Check if the given directory `path` is empty.
 * @param {String} path
 * @param {Function} fn
 */
function emptyDirectory(path, fn) {
    fs.readdir(path, function (err, files) {
        if (err && 'ENOENT' != err.code) throw err
        fn(!files || !files.length)
    })
}

/**
 * Mkdir -p.
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
    mkdirp(path, 0o755, function (err) {
        if (err) throw err
        console.log('   \x1b[36mcreate\x1b[0m : ' + path)
        fn && fn()
    })
}

/**
 * echo str > path.
 * @param {String} path
 * @param {String} str
 */
function writeFile(path, str, mode) {
    fs.writeFileSync(path, str, { mode: mode || 0o666 })
    // console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}

/**
 * Graceful exit for async STDIO
 */
function exit(code) {
    function done() {
        if (!(draining--)) _exit(code)
    }
    var draining = 0
    var streams = [process.stdout, process.stderr]
    exit.exited = true
    streams.forEach(function (stream) {
        // submit empty writeFile request and wait for completion
        draining += 1
        // stream.writeFile('', done)
    })
    done()
}