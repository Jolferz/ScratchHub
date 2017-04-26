'use strict'

let express = require('express'),
    path = require('path'),
    bcrypt = require('bcryptjs'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    Project = require('./models/project')
    // uncomment this to run database's tests
    // , testdb = require('./testdb')

let app = express()

// routes
let index = require('./routes/index'),
    profile = require('./routes/profile'),
    access = require('./routes/access'),
    project = require('./routes/project'),
    latest = require('./routes/latest')

// route handlers
app.use('/', index)
app.use('/home', index)
app.use('/profile', profile)
app.use('/registration', access)
app.use('/project', project)
app.use('/latest', latest)

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

// express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

// password init
app.use(passport.initialize())
app.use(passport.session())

// express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))

// connect flash
app.use(flash())

// global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

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