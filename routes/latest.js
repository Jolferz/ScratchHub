'use strict'

let express = require('express'),
	Project = require('../models/project'),
	exphbs = require('express-handlebars')

let	router = express.Router()

// main feed
router.get('/', function(req, res){

	Project.find({ /* all */ })
	.populate('author')
	.exec(function(err, project) {
		if (err) return res.status(500).send()

		res.render('latest', {
			projects: project
		})
	})
})


module.exports = router