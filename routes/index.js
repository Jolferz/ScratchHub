'use strict'

let express = require('express'),
	router = express.Router()

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.redirect('/latest')
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next()
	} else {
		req.flash('error_msg','You are not logged in')
		res.redirect('/index')
	}
}

module.exports = router