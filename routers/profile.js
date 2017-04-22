'use strict'

let express = require('express'),
    router = express.Router()


router.get('/', (req, res) => {
    res.render('../views/index.ejs', {title: 'profile'})
})

// GET user's profile
router.get('/profile/:id', (req, res, next) => {
    // THIS NEEDS REVISION
    res.render('/profile/' + req.params.id)
});

module.exports = router