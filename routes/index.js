'use strict'

const express = require('express')

const router = express.Router()

// =============================== //
//            index GET            //
// =============================== //
router.get('/', ensureAuthenticated, function (req, res) {
  res.redirect('latest')
})

// user access validation
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('index')
  }
}

module.exports = router
