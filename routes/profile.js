'use strict'

const express = require('express'),
	  fs = require('fs'),
      User = require('../models/user'),
	  Project = require('../models/project')

const	router = express.Router()

// =============================== //
// 		  profile update form      //
// =============================== //
router.get('/:user/update-profile', function(req, res) {
	res.render('profile-update-form')
})


// =============================== //
//         profile DELETE          //
// =============================== //
router.delete('/:user/profile-delete', function(req, res) {

	const user = req.params.user

	// find and delete user
    User.findOneAndRemove({ username: user })
	.populate('author')
	.exec(function(err, user) {
        if (err) return err

		console.log('User found by \'findOneAndRemove\': ', user)

		// find every project of current user
		Project.find({ author: user }, function(err, projects) {

			// remove every single project
			for (let i = 0; i < projects.length; i++) {				

				// remove project
				Project.remove({_id: projects[i]}, function(err, rmProjects){
					
					// delete project's image
					fs.unlink('uploads/' + projects[i].name + '.png', function(cb) {
						
						// image deleted from database 
						res.end()
					})
				})
			}
		})
    })

    // alerts the user the removal was successful
    req.flash('success_msg', 'Account deleted succesfully') 

	res.end()
})


// =============================== //
// 	  profile POST UPDATES    	   //
// =============================== //
router.post('/:user/update-profile', function(req, res){
	
	// query for the user
	User.findOne({username: req.params.user}, function(err, user) {
		if (err) return err
		if (!user) return res.status(404).send()

		// form validation
		req.checkBody({
			'name': {
				optional: {
					options: {
						checkFalsy: true
					}
				},
				isLength: {
					options: [{
						min: 3,
						max: 30
					}],
					errorMessage: '\'Name\' can have between 3 and 30 characters long.'
				}
			},
			'aboutMe': {
				optional: {
					options: {
						checkFalsy: true
					}
				},
				isLength: {
					options: [{
						min: 3,
						max: 500
					}]
				}
			}
		})

		// form validation errors
    	let errors = req.validationErrors()

		if (errors) {
			res.render('profile-update-form', {
				errors: errors
			})
		} else {
			// update profile if updated info exists
			if (req.body.name) user.name = req.body.name
			if (req.body.aboutMe) user.aboutMe = req.body.aboutMe

			// save updates
			user.save(function(err, updatedUser) {
				if (err) return err
			})

			// alerts the user the submission was successful
			req.flash('success_msg', 'Profile updated succesfully')
			
			// redirect to user's profile
			res.redirect('/profile/' + user.username)
		}	
	})
})


// =============================== //
// 			user profile    	   //
// =============================== //
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
        let modBtns = false
        if (req.session.passport.user == user._id) {
            modBtns = !modBtns
        }

		// templating engine variables' values
		res.render('profile', {
			username: user.username,
			name: user.name,
			email: user.email,
			aboutMe: user.aboutMe,
			interests: user.interests,
			projects: user.projects,
			modBtns: modBtns
		})
	})
})

module.exports = router