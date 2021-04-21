const homeRouter = require('./home')

const init = function (app) {
    app.get('/favicon.ico', (req, res, next) => { res.end('ignore favicon') })
    app.use('/', homeRouter)
}

module.exports = {
    init
}