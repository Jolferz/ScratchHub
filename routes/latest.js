'use strict'

let express = require('express'),
	router = express.Router()

// latest
router.get('/', function(req, res){
	res.render('latest')
})

module.exports = router