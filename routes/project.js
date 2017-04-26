'use strict'

let express = require('express'),
    router = express.Router(),
    project_controller = require('../controllers/project')

// GET project page
router.get('/:user', project_controller.user_project_page)

module.exports = router