'use strict'

const mongoose = require('mongoose')

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
  }
})

module.exports = mongoose.model('Comments', CommentSchema)
