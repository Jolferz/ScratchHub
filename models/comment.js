'use strict'

const mongoose = require('mongoose'),
      moment = require('moment'),
      User = require('./user'),
      Project = require('./project')

const Schema = mongoose.Schema


// =============================== //
//         comment Schema          //
// =============================== //
const CommentSchema = Schema({
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
      },
      postDate: String
})

module.exports = mongoose.model('comments', CommentSchema)