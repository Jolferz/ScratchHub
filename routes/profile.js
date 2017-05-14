	'use strict'

let express = require('express'),
    User = require('../models/user'),
	Project = require('../models/project')

let	router = express.Router()


// profile edit form
router.get('/:user/update-profile', function(req, res) {
	res.render('profile-form')
})

// user POST profile updates
router.post('/:user/update-profile', function(req, res){
	
	User.findOne({username: req.params.user}, function(err, user) {
		if (err) return err
		if (!user) return res.status(404).send()

		// form validation
		req.checkBody('name', 'Only alphabetical characters allowed').isAlpha()
		req.checkBody('email', 'Must be in an email format').isEmail()
		req.checkBody('aboutMe', 'Only alphabetical characters allowed').isAlpha()
		req.checkBody('interests', 'Only alphabetical characters allowed').isAlpha()

		// form validation errors
    	let errors = req.validationErrors()

		// update profile if updated info exists
		if (req.body.name) user.name = req.body.name
		if (req.body.email) user.email = req.body.email
		if (req.body.aboutMe) user.aboutMe = req.body.aboutMe
		if (req.body.interests) user.interests = req.body.interests

		// save updates
		user.save(function(err, updatedUser) {
			if (err) return err
		})

		// alerts the user the submission was successful
		req.flash('success_msg', 'Profile updated succesfully')
		
		// redirect to user's profile
		res.redirect('/profile/' + user.username)
	})
})


// user profile
router.get('/:user', function(req, res){

	// query for user
	User.findOne({ username: req.params.user })
	.populate('projects')
	.exec(function(err, user) {
		if (err) return res.status(500).send()
		if (!user) return res.status(404).send()

		// adds edit button in profile if the user is the owner of the page
        // NOTE: triple equals won't apply to this case as the session passport
        // is a string and the _id is an object.
        let editBtn = false
        if (req.session.passport.user == user._id) {
            editBtn = !editBtn
        }

		// templating engine variables' values
		res.render('profile', {
			username: user.username,
			name: user.name,
			email: user.email,
			aboutMe: user.aboutMe,
			interests: user.interests,
			projects: user.projects,
			editBtn: editBtn
		})
	})
})

module.exports = router