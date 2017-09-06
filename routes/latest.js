'use strict'

const express = require('express')
const Project = require('../models/project')

const router = express.Router()

// =============================== //
//          latest GET             //
// =============================== //
router.get('/', function (req, res) {
  Project.find({ /* all */ })
  .populate('author')
  .exec(function (err, project) {
    if (err) return res.status(500).send()
    
    // order the project in a chronological order (newest to oldest)
    project = project.reverse()

    res.render('latest', {
      projects: project
    })
  })
})

module.exports = router
