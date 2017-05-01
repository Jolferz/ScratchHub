'use strict'

let express = require('express')

let	router = express.Router()

// homepage GET request
router.get('/', ensureAuthenticated, function(req, res){
	res.redirect('latest')
})

// user access validation
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next()
	} else {
		req.flash('error_msg','You are not logged in')
		res.redirect('index')
	}
}

module.exports = router