const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const logger = require('./lib/logger')
const router = require('./routes/index')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// helmet setting
app.use(helmet.hidePoweredBy())
app.use(helmet.dnsPrefetchControl())
app.use(helmet.hsts({maxAge: 5184000}))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.xssFilter())

router.init(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    let errorViewName = 'error'
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    if (process.env.TARS_CONFIG) {
        errorViewName = 'errorFriendly'
        logger.error.error(err.stack)
    }
    // render the error page
    res.status(err.status || 500)
    res.render(errorViewName)
})

module.exports = app
