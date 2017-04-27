'use strict'

let express = require('express'),
	router = express.Router()

// latest
router.get('/', function(req, res){
    req.session.destroy();
	res.render('index')
})

module.exports = router