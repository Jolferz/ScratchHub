'use strict'

const express = require('express'),
      Comment = require('../models/comment'),
	  Project = require('../models/project'),
	  exphbs = require('express-handlebars')

const router = express.Router()


// =============================== //
//          comment POST           //
// =============================== //
router.post('/', function(req, res){

	Comment.find({ /* all */ })
	.populate('commenter')
    .populate('project')
	.exec(function(err, results) {
		if (err) return res.status(500).send()

		res.render('latest', {
			projects: project
		})
	})
})


module.exports = router