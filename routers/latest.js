'use strict'

let express = require('express'),
	router = express.Router()

// GET sign in page
router.get('/', (req, res, next) => {
	res.render('../views/latest', {
		title: 'ScratchHub'
	})
})

module.exports = router