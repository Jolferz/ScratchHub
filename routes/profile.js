'use strict'

let express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    profile_controller = require('../controllers/profile')

// GET project page
router.get('/:user', profile_controller.user_profile_page)

module.exports = router