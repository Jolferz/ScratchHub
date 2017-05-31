'use strict'

const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

const router = express.Router()

// =============================== //
//            index GET            //
// =============================== //
router.get('/', function (req, res) {
  res.render('index')
})

// =============================== //
//          login GET form         //
// =============================== //
router.get('/login', function (req, res) {
  res.render('login')
})

// =============================== //
//            login POST           //
// =============================== //
router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/index/login', failureFlash: true}),
  function (req, res) {
    res.redirect('/')
  }
)

// =============================== //
//        register GET form        //
// =============================== //
router.get('/register', function (req, res) {
  res.render('register')
})

// =============================== //
//          register POST          //
// =============================== //
router.post('/register', function (req, res) {
  // form fields' data
  const name = req.body.name
  const email = req.body.email
  const username = req.body.username.toLowerCase()
  const password = req.body.password
  // validation
  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username is required and can only contain alphabetical characters').notEmpty().isAlpha()
  req.checkBody({
    'password': {
      notEmpty: true,
      isLength: {
        options: [{ min: 6, max: 30 }],
        errorMessage: 'Password\'s length must be between 6 and 30 characters long'
      },
      errorMessage: 'Password is required'
    }
  })
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)
  // form validation errors
  const errors = req.validationErrors()
  // if no error found, create new User document in the db
  if (errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    // creates new user
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    })

    User.createUser(newUser, function (err) {
      if (err && err.code !== 11000) {
        // errors
        console.log(err)
        console.log(err.code)
        res.send('Another error showed up')
      } else if (err && err.code === 11000) {
        // throws duplicate key error 11000
        req.flash('error', 'Username is already taken')
        res.redirect('/index/register')
      } else {
        // alerts the user the submission was successful
        req.flash('success_msg', 'You are registered and can now login')
        // redirects the user to the login screen
        res.redirect('/index/login')
      }
    })
  }
})

// =============================== //
//         Passport Strategy       //
// =============================== //
passport.use(new LocalStrategy(
function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    // check for errors
    if (err) return err
    // check if session exists
    if (!user) {
      return done(null, false, {message: 'Incorrect username or password'})
    }
    User.comparePassword(password, user.password, function (err, isMatch) {
      // check for errors
      if (err) return err
      // check password's match before continuing
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, {message: 'Invalid password'})
      }
    })
  })
}))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

module.exports = router
