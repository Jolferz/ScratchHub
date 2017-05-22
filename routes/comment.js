'use strict'

const express = require('express'),
      comments = require('../models/comment'),
	  User = require('../models/user'),
	  Project = require('../models/project'),
	  exphbs = require('express-handlebars'),
	  moment = require('moment')

const router = express.Router()


// =============================== //
//          comment POST           //
// =============================== //
router.post('/:project', function(req, res) {

    let commenter = req.session.passport.user,
        comment = req.body.comment,
        project = req.params.project
    
    // post validation
    req.checkBody({
       'comment': {
            notEmpty: {
                options: true,
                errorMessage: 'Can\'t post empty message'
            },
            isLength: {
                options: [{ max: 300 }],
                errorMessage: 'Message cannot contain more than 200 characters'
            },
        }
    })

    const errors = req.validationErrors()

    // error check
    if (errors) {

        // query for the project
        Project.findOne({ name: project })
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
                    errors: errors,
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
    } else {

        // push comment to the project model
        Project.findOne({ name: project }, function(err, project) {
            if (err) return err

            // create new comment
            const newComment = new comments({
                    commenter: commenter,
                    comment: comment,
                    project: project._id,
                    date: Date.now(),
                    postDate: moment().format('MMMM Do YYYY')
            })

            // save comment
            newComment.save(function(err) {if (err) return err})

            console.log(newComment)
            
            // push the comment to the array of comments in the project
            project.comments.push(newComment._id)

            // saves project
            project.save(function(err) {if (err) return err})

            User.findOne({ _id: commenter }, function(err, user) {
                user.comments.push(newComment._id)
                user.save(function(err){if (err) return err})
            })
        })

        // alerts the user the submission was successful
        req.flash('success_msg', 'Comment posted!')

        // redirects the user to the projects page
        res.redirect('/project/' + project)
    }
})


// =============================== //
//        comment GET delete       //
// =============================== //
router.get('/:project/:id/delete', function(req, res) {

    const project = req.params.project

    comments.findOneAndRemove({ _id: req.params.id }, function(err, comment) {
        if (err) return err

        // remove comment
    })

    // alerts the user the submission was successful
    req.flash('success_msg', 'Comment deleted')

    // redirects the user to the projects page
    res.redirect('/project/' + project)
})


module.exports = router