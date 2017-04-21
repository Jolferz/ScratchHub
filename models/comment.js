'use strict'

const mongoose = require('mongoose'),
    user = require('user'),
    project = require('project')

let Schema = mongoose.Schema

// define comment Schema
let CommentSchema = Schema({
    commenter: user._id,
    comment: String,
    project: project._id
})

module.exports = mongoose.model('Comment', CommentSchema)