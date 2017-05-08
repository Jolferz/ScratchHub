'use strict'

let express = require('express'),
	Project = require('../models/project'),
	exphbs = require('express-handlebars')

let	router = express.Router()

// 'latest' GET request
router.get('/', function(req, res){

	Project.find({ })
	.populate('author')
	.exec(function(err, project) {
		if (err) return res.status(500).send()

		res.render('latest', {
			projects: project
		})
	})
})

// testing project image
router.get('/uploads/:img', function(req, res) {
    console.log(req.params.img)
    res.send(req.params.img + '.png')
})


module.exports = router