'use strict'

let mongoose = require('mongoose'),
    moment = require('moment'),
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
    },
    date: {
        type: Date,
        default: Date.now
    }
})


CommentSchema.virtual('post_date').get(function() {
    return moment(this.date).format('MMMM Do, YYYY - h:mm a')
})

module.exports = mongoose.model('Comment', CommentSchema)