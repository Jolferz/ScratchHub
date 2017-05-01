'use strict'

let express = require('express')

let	router = express.Router()

// logout GET request, sends user to index after logging out of the session
router.get('/', function(req, res){
    req.session.destroy();
	res.render('index')
})

module.exports = router