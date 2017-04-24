'use strict'

let express = require('express'),
    router = express.Router()

// GET project page
router.get('/', (req, res, next) => {
    res.render('../views/project', {
        title: 'ScratchHub'
    })
});

module.exports = router