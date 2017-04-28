'use strict'

let express = require('express'),
	router = express.Router(),
    User = require('../models/user'),
    Project = require('../models/project')

// project form
router.get('/new-project', function(req, res){
	res.render('project-form')
})

// project submit
router.post('/new-project', function(req, res){
    let name = req.body.name,
        description = req.body.description,
        iframe = req.body.iframe,
        category = req.body.category
        
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('description', 'Add a description').notEmpty()
    req.checkBody('iframe', 'iframe is required').notEmpty()

    let errors = req.validationErrors()

    
    let newProject = new Project({
        name: name,
        description: description,
        iframe: iframe,
        category: category
    })
   

    newProject.save(function(err) {
        if (err) return err
    })

    req.flash('success_msg', 'Your project page is live!')

	res.redirect('latest')

})

// profile form
router.get('/update-profile', function(req, res){
	res.render('update-profile')
})

// latest
router.get('/:project', function(req, res){
    // same code as profile - look it up for reference
	User.findOne({project: req.params.project})
    .exec(function(err, project) {
        if (err) throw err
        res.render('project')
    })
})

module.exports = router