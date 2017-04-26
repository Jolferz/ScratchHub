'use strict'

let express = require('express'),
	router = express.Router()

let User = require('../models/user')

// register GET
router.get('/', function(req, res) {
	res.render('../views/registration', {
		title: 'ScratchHub'
	})
})

// register POST
router.post('/', function(req, res) {
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
	req.checkBody('password', 'Password do not match').equals(req.body.password)

	var errors = req.validationErrors()

	if (errors) {
		res.render('../views/registration', {
			errors: errors
		})
	} else {
		let newUser = new User({
			username: username,
			email: email,
			password: password
		})

		User.createUser(newUser, function(err, user) {
			if (err) throw err
			console.log(user)
		})

		req.flash('success_msg', 'You are registered and can now log in!')

		res.redirect('../views/latest ')
	}

	res.render('../views/registration', {
		title: 'ScratchHub'
	})
})

module.exports = router