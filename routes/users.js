'use strict'

let express = require('express'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user')

let	router = express.Router()

// index
router.get('/', function(req, res){
	res.render('index')
})

// register
router.get('/register', function(req, res){
	res.render('register')
})

// login
router.get('/login', function(req, res){
	res.render('login')
})

// register user
router.post('/register', function(req, res){

	// form fields' data
	let name = req.body.name,
		email = req.body.email,
		username = req.body.username,
	 	password = req.body.password,
	 	password2 = req.body.password2

	// validation
	req.checkBody('name', 'Name is required').notEmpty()
	req.checkBody('email', 'Email is required').notEmpty()
	req.checkBody('email', 'Email is not valid').isEmail()
	req.checkBody('username', 'Username is required').notEmpty()
	req.checkBody('password', 'Password is required').notEmpty()
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

	// form validation errors
	let errors = req.validationErrors()

	// if no error found, create new User document in the db
	if (errors) {
		res.render('register', {
			errors: errors
		})
	} else {
		let newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		})

		User.createUser(newUser, function(err, user) {
			if (err) throw err
		})

		// alerts the user the submission was successful
		req.flash('success_msg', 'You are registered and can now login')

		// redirects the user to the projects page
		res.redirect('/index/login')
	}
})

passport.use(new LocalStrategy(
function(username, password, done) {

	User.getUserByUsername(username, function(err, user) {

		// check for errors
		if(err) throw err

		// check if session exists
		if(!user) {
			return done(null, false, {message: 'Unknown User'})
		}

		User.comparePassword(password, user.password, function(err, isMatch) {

			// check for errors
			if(err) throw err

			// check password's match before continuing
			if(isMatch) {
				return done(null, user)
			} else {
				return done(null, false, {message: 'Invalid password'})
			}
		})
	})
}))

passport.serializeUser(function(user, done) {
	done(null, user.id)
})

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user)
	})
})


router.post('/login',
	passport.authenticate('local', {successRedirect:'/', failureRedirect:'/index/login',failureFlash: true}),
	function(req, res) { res.redirect('/') })


// user logout request
router.get('/logout', function(req, res) {

	req.logout()

	// alerts the user the submission was successful
	req.flash('success_msg', 'You are logged out')

	// redirects the user to the projects page
	res.redirect('/index/login')
})

module.exports = router