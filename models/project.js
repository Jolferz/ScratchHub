'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

// define project Schema
let ProjectSchema = Schema({
  name: {
    type: String,
    required: true,
    max: 35,
    index: {
      unique: true
    }
  },
  description: String,
  iframe: String,
  category: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    max: 1
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comments',
    max: 200
  }],
  image: {
    type: String,
    max: 1
  },
  cardDate: String,
  date: Date
}, {
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
})

// ProjectSchema url field
ProjectSchema.virtual('url').get(function () {
  return ('/project/' + this.name).replace(/\s+/g, '-')
})

module.exports = mongoose.model('Project', ProjectSchema)
