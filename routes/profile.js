'use strict'

let express = require('express'),
	router = express.Router(),
    User = require('../models/user'),
	Project = require('../models/project')



router.get('/:user/update-profile', function(req, res) {
	res.render('profile-form')
})

// profile edit form
router.post('/:user/update-profile', function(req, res){
	
	User.findOne({username: req.params.user}, function(err, user) {
		if (err) return err
		if (!user) return res.status(404).send()

		let name = req.body.name,
			email = req.body.email,
			aboutMe = req.body.aboutMe,
			interests = req.body.interests

		// form validation
		req.checkBody('name', 'Only alphabetical characters allowed').isAlpha()
		req.checkBody('email', 'Must be in an email format').isEmail()
		req.checkBody('aboutMe', 'Only alphabetical characters allowed').isAlpha()
		req.checkBody('interests', 'Only alphabetical characters allowed').isAlpha()

		// form validation errors
    	let errors = req.validationErrors()

		// update profile
		user.name = name
		user.email = email
		user.aboutMe = aboutMe
		user.interests = interests

		user.save(function(err, updatedUser) {
			if (err) return err
		})

		// alerts the user the submission was successful
		req.flash('success_msg', 'Profile updated succesfully')
		
		res.redirect('/profile/' + user)
	})

	

})


// user profile
router.get('/:user', function(req, res){
	
	User.findOne({ username: req.params.user}, function(err, user) {
		if (err) return res.status(500).send()
		if (!user) return res.status(404).send()
		
		res.render('profile', {
			username: user.username,
			name: user.name,
			email: user.email,
			aboutMe: user.aboutMe,
			interests: user.interests,
			projects: user.projects
		})
	})
})

module.exports = router