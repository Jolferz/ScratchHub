'use strict'

let Project = require('../models/project'),
    User = require('../models/user'),
    _Comment = require('../models/comment')

exports.user_project_page = (req, res) => {

    User.findOne({project: req.params.project})
    .exec(function(err, project) {
        if (err) throw err
        res.render('../views/project', {
            title: 'ScratchHub',
            user: project.username,
            project: project.project
        })
    })

}