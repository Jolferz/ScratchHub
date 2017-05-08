'use strict'

let express = require('express'),
    User = require('../models/user'),
    Project = require('../models/project'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs'),
    multer = require('multer')

// router
let	router = express.Router()

// image storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name +'.png' )
    }
})

let upload = multer({ storage: storage })

// project form
router.get('/new-project', function(req, res) {
	res.render('project-form')
})

// project page form
router.post('/new-project', upload.single('projectImage'), function(req, res) {
    
    // form fields' data
    let name = req.body.name,
        description = req.body.description,
        category = req.body.category,
        iframe = req.body.iframe

    // image object print
    console.log(req.file)
    
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

    // adds the project to the list of projects of the corresponding user and saves the document
    User.findOne({ _id: req.session.passport.user },
    function(err, user) {
        user.projects.push(newProject)
        user.save(function(err) {
            if (err) return err
        })
    })


    // alerts the user the submission was successful
    req.flash('success_msg', 'Your project page is live!')

    // redirects the user to the projects page
	res.redirect('/project/' + name)

})

// project page data
router.get('/:project', function(req, res) {

    // query for user
	Project.findOne({ name: req.params.project })
    .populate('author')
    .exec(function(err, project) {
        if (err) throw err

        // templating engine variables' values
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