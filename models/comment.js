'use strict'

let mongoose = require('mongoose'),
    User = require('./user'),
    Project = require('./project')

let Schema = mongoose.Schema

// define comment Schema
let CommentSchema = Schema({
    commenter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String,
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
})

module.exports = mongoose.model('Comment', CommentSchema)