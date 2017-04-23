let express = require('express'),
	router = express.Router()

// GET sign in page
router.get('/', (req, res, next) => {
	res.render('../views/sign_up', {
		 title: 'ScratchHub' 
		})
})

module.exports = router