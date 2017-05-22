'use strict'

const express = require('express'),
      User = require('../models/user'),
      Project = require('../models/project'),
      comments = require('../models/comment'),
      fs = require('fs'),
      multer = require('multer'),
      moment = require('moment'),
      passport = require('passport')

// router
const router = express.Router()

// image storage and filename renamed same as project
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name +'.png' )
    }
})

const upload = multer({ storage: storage })


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
                            min: 20,
                            max: 500
                        }],
                        errorMesagge: '\'Description\' must contain at least 20 characters'
                    }
                }
            })            
        } else {
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
                        errorMessage: '\'Name\' must contain between 3 and 30 characters.'
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
                            min: 20,
                            max: 500
                        }],
                        errorMessage: '\'Description\' must contain between 20 and 500 characters' 
                    }
                }
            })
        }
        
        // form validation errors
    	const errors = req.validationErrors()

        if (errors) {
			res.render('project-update-form', {
				errors: errors
			})
        } else {
            // update project if updated info exists
            if (req.body.name) project.name = req.body.name
            if (req.body.description) project.description = req.body.description
            if (req.body.category) project.category = req.body.category

            project.save(function(err, updatedProject) {if (err) return err})

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
router.delete('/:project/project-delete', function(req, res) {

    // delete project
    Project.findOneAndRemove({ name: req.params.project }, function(err, project) {
        if (err) return err

        // delete all comments within the project
        comments.find({ project: project._id }).remove().exec( function(err, comment) {})

        // delete project's image
        fs.unlink('uploads/' + project.name + '.png', function(cb) {
            // image deleted from database 
            res.end()
        })
    })

    // alerts the user the removal was successful
    req.flash('success_msg', 'Project deleted succesfully') 
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
    const name = req.body.name,
          description = req.body.description,
          category = req.body.category,
          iframe = req.body.iframe
    
    // form validation
    if (name === 'default') {
        // if name is 'default', return an error and ask the user to choose a different one
        req.checkBody('name', 'The name \'default\' is not valid. Please, choose a different name for your project.').isEmpty()
    } else {
        req.checkBody({
            'name': {
                isLength: {
                    options: [{
                        min: 3,
                        max: 30
                    }],
                    errorMessage: '\'Name\' must contain between 3 and 30 characters.'
                }
            },
            'description': {
                isLength: {
                    options: [{
                        min: 20,
                        max: 500
                    }],
                    errorMessage: '\'Description\' must contain between 20 and 500 characters' 
                }
            },
            'iframe': {
                notEmpty: true,
                errorMessage: 'Please, provide the iframe of your project'
            }
        })
    }

    // form validation errors
    const errors = req.validationErrors()

    if (errors) {
        // deletes provided image unless the user named its projest 'default' in which case
        // it avoids deleting the default image in disk
        if (('uploads/' + name + '.png') !== 'uploads/default.png') { 
            fs.unlink('uploads/' + name + '.png', function(cb){
               // image deleted from database 
            })
        }
        res.render('project-form', {
            errors: errors
        })
    } else {
        // create new project
        const newProject = new Project({
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
            if ( err && err.code !== 11000 ) {
				// errors
				console.log(err)
				console.log(err.code)
				res.send('Another error showed up')
			} else if ( err && err.code === 11000 ) {
				// throws duplicate key error 11000
				req.flash('error', 'Sorry, but this project name is already taken. Please, try different one.')
				res.redirect('/project/new-project')
			} else {
                console.log(newProject)

                // adds the project to the list of projects of the corresponding user and saves the document
                // ** NOTE: find out a way so MongoDB updates the user's project entry automatically ** //
                User.findOne({ _id: req.session.passport.user },
                function(err, user) {
                    user.projects.push(newProject)
                    user.save(function(err) {if (err) return err})
                })
                
                // alerts the user the submission was successful
                req.flash('success_msg', 'Your project page is live!')

                // redirects the user to the projects page
                res.redirect('/project/' + name)
            }
        })
    }
})


// =============================== //
//          project page           //
// =============================== //
router.get('/:project', function(req, res) {
    
    // query for the project
	Project.findOne({ name: req.params.project })
    .populate('author')
    .populate('projects')
    .populate('comments')
    .exec(function(err, project) {
        if (err) throw err

        comments.find({ project: project._id })
        .populate('commenter')
        .exec(function(err, comment) {

            // adds delete button in profile if the user is the author of the project
            // NOTE: triple equals won't apply to this case as the session is a string 
            // and the _id is an object.
            let modBtns = false
            if (req.session.passport.user == project.author._id) {
                modBtns = !modBtns
            }

            let userId = req.session.passport.user 

            // templating engine variables' values
            res.render('project', {
                userId: userId,
                name: project.name,
                description: project.description,
                iframe: project.iframe,
                category: project.category,
                author: project.author.name,
                authorLink: project.author.username,
                comments: comment,
                modBtns: modBtns
            })
        })
    })
})


module.exports = router