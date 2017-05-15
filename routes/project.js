'use strict'

let express = require('express'),
    User = require('../models/user'),
    Project = require('../models/project'),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs'),
    multer = require('multer'),
    moment = require('moment')

// router
let	router = express.Router()

// image storage and filename renamed same as project
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name +'.png' )
    }
})

let upload = multer({ storage: storage })


// =============================== //
//     project GET UPDATE form     //
// =============================== //
router.get('/:project/update-project', function(req, res) {
    res.render('project-update-form')
})

// =============================== //
//       project POST UPDATES      //
// =============================== //
router.post('/:project/update-project', function(req, res) {

    // query for the project
    Project.findOne({ name: req.params.project }, function(err, project) {
        if (err) return err
		if (!project) return res.status(404).send()

        // form validation
        if (req.body.name === 'default') {
            console.log('ENTERED default conditional')
            req.checkBody({
                'name': {
                    isEmpty: false,
                    errorMessage: 'The name \'default\' is not valid. Please, choose a different name for your project.'
                },
                'description': {
                    optional: {
                        options: {
                            checkFalsy: true
                        }
                    },
                    isLength: {
                        options: [{
                            min: 3,
                            max: 500
                        }]
                    }
                }
            })            
        } else {
            console.log('FAILED default conditional')
            req.checkBody({
                'name': {
                    optional: {
                        options: {
                            checkFalsy: true
                        }
                    },
                    isLength: {
                        options: [{
                            min: 3,
                            max: 30
                        }],
                        errorMessage: '\'Name\' can have between 3 and 30 characters long.'
				    }
                },
                'description': {
                    optional: {
                        options: {
                            checkFalsy: true
                        }
                    },
                    isLength: {
                        options: [{
                            min: 3,
                            max: 500
                        }]
                    }
                }
            })
        }
        
        // form validation errors
    	let errors = req.validationErrors()

        if (errors) {
			res.render('project-update-form', {
				errors: errors
			})
        } else {
            // update project if updated info exists
            if (req.body.name) project.name = req.body.name
            if (req.body.description) project.description = req.body.description
            if (req.body.category) project.category = req.body.category

            project.save(function(err, updatedProject) {
                if (err) return err
            })

            // alerts the user the submission was successful
            req.flash('success_msg', 'Project updated succesfully')
            
            // redirect to user's profile
            res.redirect('/project/' + project.name)
        }
    })
})


// =============================== //
//         project DELETE          //
// =============================== //
router.delete('/:user/project-delete', function(req, res) {

    let user = req.session.passport._id

    Project.findOneAndRemove({ name: req.params.user }, function(err, user) {
        if (err) return err

        // remove document and project's image <<<<<<<<<<<<<<<<<<<<<<<<<<
        console.log(' ')
        console.log('user removed: ' + user)
        
    })

    // alerts the user the removal was successful
    req.flash('success_msg', 'Project removed succesfully') 

    res.send(JSON.stringify(user))
})


// =============================== //
//        project GET form         //
// =============================== //
router.get('/new-project', function(req, res) {
	res.render('project-form')
})


// =============================== //
//        project POST form        //
// =============================== //
router.post('/new-project', upload.single('projectImage'), function(req, res) {

    // form fields' data
    let name = req.body.name,
        description = req.body.description,
        category = req.body.category,
        iframe = req.body.iframe
    
    // form inputs validation
    if (name === 'default') {
        // if name is 'default', return an error and ask the user to choose a different one
        req.checkBody('name', 'The name \'default\' is not valid. Please, choose a different name for your project.').isEmpty()
    } else {
        req.checkBody('name', 'Name length must contain between 2 and 15 characters').notEmpty().isLength([{ min: 2, max: 30 }])
    }

    req.checkBody('description', 'Invalid description').isLength([{ max: 500 }])
    req.checkBody('iframe', 'iframe is required').notEmpty().isLength([{ max: 500 }])


    // form validation errors
    let errors = req.validationErrors()

    // validation error triggered. 
    if (errors) {
        // checks if image name is equal to 'default.png' (avoids deleting default image when user fails to provide one.
        if (('uploads/' + name + '.png') !== 'uploads/default.png') { 
            fs.unlink('uploads/' + name + '.png', function(cb){
               // image deleted from database 
            })
        }
        res.render('project-form', {
            errors: errors
        })
    } else {
        // creates new project
        let newProject = new Project({
            name: name,
            description: description,
            iframe: iframe,
            category: category,
            author: req.session.passport.user,
            image: name + '.png',
            date: Date.now(),
            cardDate: moment().format('MMMM Do YYYY')
        })

        // if the user chose not to upload an image, the image name for the project 
        // will change to default and the program will assign accordingly
        if (!fs.existsSync('uploads/' + name + '.png')) {
            newProject.image = 'default'
        }

        // saves the project
        newProject.save(function(err) {
            if (err) return err
        })

        console.log(newProject)

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
    }
})


// =============================== //
//          project page           //
// =============================== //
router.get('/:project', function(req, res) {
    // query for user
	Project.findOne({ name: req.params.project })
    .populate('author')
    .exec(function(err, project) {
        if (err) throw err

        // adds delete button in profile if the user is the author of the project
        // NOTE: triple equals won't apply to this case as the session is a string 
        // and the _id is an object.
        let dltBtn = false
        if (req.session.passport.user == project.author._id) {
            dltBtn = !dltBtn
        }

        // templating engine variables' values
        res.render('project', {
            name: project.name,
            description: project.description,
            iframe: project.iframe,
            category: project.category,
            author: project.author.name,
            authorLink: project.author.username,
            dltBtn: dltBtn
        })
    })
})


module.exports = router