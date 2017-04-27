'use strict'

let express = require('express'),
	router = express.Router(),
    User = require('../models/user')

// latest
router.get('/:project', function(req, res){
	User.findOne({project: req.params.project})
    .exec(function(err, project) {
        if (err) throw err
        res.render('project')
        // res.json(project)
    })
})

module.exports = router