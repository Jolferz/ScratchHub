'use strict'

let express = require('express'),
    User = require('../models/user'),
    Project = require('../models/project'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs')

let	router = express.Router()

// project form
router.get('/new-project', function(req, res) {
	res.render('project-form')
})

router.get('/upload', function(req, res) {
	res.render('upload')
})

// project page form
router.post('/new-project', function(req, res) {
    
    // form fields' data
    let name = req.body.name,
        description = req.body.description,
        category = req.body.category,
        iframe = req.body.iframe
    
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


    // ====================  UPLOAD BUTTON START ========================= //
    // upload button handler
    // create an incoming form object
    let form = new formidable.IncomingForm()

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false

    // store all uploads in the /new-project directory
    form.uploadDir = path.join(__dirname, '/new-project')

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name))
    })

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err)
    })

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success')
    })

    // parse the incoming request containing the form data
    form.parse(req)
    // ====================  UPLOAD BUTTON END ========================= //


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