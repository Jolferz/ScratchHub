'use strict'

let express = require('express'),
	router = express.Router(),
    User = require('../models/user')

// hard coded profile
router.get('/:user', function(req, res){
	res.render('profile', {
		username: req.params.user,
		name: 'Stephanie Carpio',
		email: 'StephCarpio@gmail.com'
	})
})

module.exports = router