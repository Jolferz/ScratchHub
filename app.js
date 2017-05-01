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

// database connection
mongoose.connect('mongodb://localhost/ScratchHub')

// database
let db = mongoose.connection

// route handlers
let index = require('./routes/index'),
    users = require('./routes/users'),
    latest = require('./routes/latest'),
    project = require('./routes/project'),
    profile = require('./routes/profile'),
    logout = require('./routes/logout')

// app init
let app = express()

// resolves db deprecation warning 'Mongoose: mpromise'
mongoose.Promise = require('bluebird')

// view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'layout'}))
app.set('view engine', 'handlebars')

// bodyParser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// express session (don't include the secret in the final app version or repository) <===============================
// express session (don't include the secret in the final app version or repository) <===============================
// express session (don't include the secret in the final app version or repository) <===============================
// express session (don't include the secret in the final app version or repository) <===============================
app.use(session({
    secret: 'secretish',
    saveUninitialized: true,
    resave: true
}))

// passport init
app.use(passport.initialize())
app.use(passport.session())

// express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      let namespace = param.split('.'), 
      root = namespace.shift(),
      formParam = root

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

// flash init
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
app.use('/', index)
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

