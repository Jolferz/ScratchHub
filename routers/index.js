'use strict'

let express = require('express'),
	router = express.Router()

// GET home page
router.get('/', (req, res, next) => {
	res.render('../views/index', { title: 'ScratchHub' })
})

router.get('/index', (req, res, next) => {
	res.render('../views/index', { title: 'ScratchHub' })
})

module.exports = router