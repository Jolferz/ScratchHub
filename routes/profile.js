'use strict'

let express = require('express'),
	router = express.Router(),
    User = require('../models/user')


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