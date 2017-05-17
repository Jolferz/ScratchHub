'use strict'

const express = require('express'),
	  Project = require('../models/project'),
	  exphbs = require('express-handlebars')

const router = express.Router()


// =============================== //
//          project image          //
// =============================== //
router.get('/:img', function(req, res) {
	res.sendFile('/uploads/' + req.params.img, { root: './'})
})


module.exports = router