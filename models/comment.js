<<<<<<< HEAD
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

=======
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

>>>>>>> 49c8affb7f20bd6c43e758b2db802fcaa019f9cc
module.exports = mongoose.model('Comment', CommentSchema)