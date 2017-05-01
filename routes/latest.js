'use strict'

let express = require('express')

let	router = express.Router()

// 'latest' GET request
router.get('/', function(req, res){
	res.render('latest')
})

module.exports = router