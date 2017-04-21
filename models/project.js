'use strict'

const mongoose = require('mongoose'),
    User = require('./user')

let Schema = mongoose.Schema

// define project Schema
let ProjectSchema = Schema({
    name: String,
    description: String,
    iframe: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

// ProjectSchema url field
ProjectSchema.virtual('url').get(function() {
    console.log('program entered url virtual\'s callback')
    return  '/project/' + this.name
})

module.exports = mongoose.model('Project', ProjectSchema)