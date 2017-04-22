let express = require('express'),
	router = express.Router()

// GET home page
router.get('/', (req, res, next) => {
	res.render('../views/index.ejs', {
		 title: 'ScratchHub' 
		})
})

router.get('/home', (req, res, next) => {
	res.render('../views/index.ejs', { title: 'ScratchHub' })
})

module.exports = router