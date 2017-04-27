'use strict'

let express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose')
// uncomment this to run database's tests
    // , testdb = require('./testdb')

mongoose.connect('mongodb://localhost/ScratchHub')
let db = mongoose.connection

// route handlers
let routes = require('./routes/index'),
	  users = require('./routes/users'),
	  latest = require('./routes/latest'),
	  project = require('./routes/project'),
    profile = require('./routes/profile'),
    logout = require('./routes/logout')

// Init App
let app = express()

// gets rid of the db deprecation warning 'Mongoose: mpromise'
mongoose.Promise = require('bluebird')

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars')

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}))

// flash connection
app.use(flash())

// global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})


// url requests
app.use('/', routes)
app.use('/index', users)
app.use('/latest', latest)
app.use('/project', project)
app.use('/profile', profile)
app.use('/logout', logout)


// Set Port
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'))
})

module.exports = app

