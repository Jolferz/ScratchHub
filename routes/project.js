'use strict'

let express = require('express'),
	router = express.Router(),
    User = require('../models/user'),
    Project = require('../models/project')

// project form
router.get('/new-project', function(req, res) {
	res.render('project-form')
})

// project page form
router.post('/new-project', function(req, res) {
    
    let name = req.body.name,
        description = req.body.description,
        iframe = req.body.iframe,
        category = req.body.category
    
    // form validation
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('description', 'Add a description').notEmpty()
    req.checkBody('iframe', 'iframe is required').notEmpty()

    // form validation errors
    let errors = req.validationErrors()

    // creates new project
    let newProject = new Project({
        name: name,
        description: description,
        iframe: iframe,
        category: category,
        author: req.session.passport.user
    })
   
    // saves the project
    newProject.save(function(err) {
        if (err) return err
    })

    // alerts the user the submission was successful
    req.flash('success_msg', 'Your project page is live!')

    // redirects the user to the projects page
	res.redirect('/project/' + name)

})

// project page data
router.get('/:project', function(req, res){

	Project.findOne({name: req.params.project})
    .populate('author')
    .exec(function(err, project) {
        if (err) throw err

        res.render('project', {
            name: project.name,
            description: project.description,
            iframe: project.iframe,
            category: project.category,
            author: project.author.name,
            authorLink: project.author.username
        })
    })
})

module.exports = router