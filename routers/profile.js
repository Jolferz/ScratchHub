'use strict'

let express = require('express'),
    router = express.Router()

// GET user's profile
router.get('/', (req, res, next) => {
    // THIS NEEDS REVISION
    res.render('../views/profile', {
        title: 'ScratchHub'
    })
});

module.exports = router