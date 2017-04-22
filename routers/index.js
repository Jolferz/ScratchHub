let express = require('express'),
	router = express.Router()

// GET home page
router.get('/', function(req, res, next) {
	res.render('../views/index.ejs', { title: 'ScratchHub' })
})

module.exports = router