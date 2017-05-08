'use strict'

let express = require('express'),
	Project = require('../models/project'),
	exphbs = require('express-handlebars')

let	router = express.Router()

// testing project image
router.get('/:img', function(req, res) {
    res.json(req.params.img)
})


module.exports = router