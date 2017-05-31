#!/usr/bin/env node
'use strict'

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')

// database connection
mongoose.connect('mongodb://localhost/ScratchHub')

// database
const db = mongoose.connection

// route handlers
const index = require('./routes/index')
const users = require('./routes/users')
const latest = require('./routes/latest')
const project = require('./routes/project')
const profile = require('./routes/profile')
const comment = require('./routes/comment')
const logout = require('./routes/logout')
const uploads = require('./routes/uploads')

// app init
const app = express()

// resolves db deprecation warning 'Mongoose: mpromise'
mongoose.Promise = require('bluebird')

// view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', exphbs({defaultLayout: 'layout.hbs'}))
app.set('view engine', 'hbs')

// express session (don't include the secret in the final app version or repository) <===============================
app.use(session({
  secret: 'secretish',
  saveUninitialized: true,
  resave: true
}))

// handlebars module
const hbs = require('handlebars')

// handlebars custom helpers
// concat helper
hbs.registerHelper('concat', function (filename) {
  if (filename === 'default') {
    return filename + '.png'
  }
  return filename
})
// compare helper
hbs.registerHelper('compare', function (value1, value2, options) {
  console.log('this: ', this)
  console.log('options: ', options)
  if (value1 != value2) {
    return options.inverse(this)
  } else {
    return options.fn(this)
  }
})

// bodyParser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// passport init
app.use(passport.initialize())
app.use(passport.session())

// express validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.')
    let root = namespace.shift()
    let formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
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
app.use('/comment', comment)
app.use('/logout', logout)
app.use('/uploads', uploads)

// set port
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'))
})

module.exports = app
