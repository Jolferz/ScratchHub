'use strict'

let express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    Project = require('./models/project')
    // uncomment this to run database's tests
    // , testdb = require('./testdb')

let app = express()

// routers
let index = require('./routers/index'),
    profile = require('./routers/profile'),
    registration = require('./routers/registration'),
    project = require('./routers/project'),
    latest = require('./routers/latest')

// route handlers
app.use('/', index)
app.use('/home', index)
app.use('/profile', profile)
app.use('/registration', registration)
app.use('/project', project)
app.use('/latest', latest)
// app.use('/latest', latest)

// gets rid of the db deprecation warning 'Mongoose: mpromise'
mongoose.Promise = require('bluebird')

// avoids warning of possible EventEmitter memory leak
process.setMaxListeners(0)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/public', express.static(path.join(__dirname, '/public')))


// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// database connection
let mongoDB = 'mongodb://127.0.0.1/my_database'
mongoose.connect(mongoDB)

// default connection
let db = mongoose.connection

// connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// confirm connection to the database
db.once('open', () => {console.log('We are connected to the database!')})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app