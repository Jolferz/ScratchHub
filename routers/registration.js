'use strict'

let express = require('express'),
	router = express.Router()

// GET sign in page
router.get('/', (req, res, next) => {
	res.render('../views/registration', {
		title: 'ScratchHub'
	})
})

module.exports = router