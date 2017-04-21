'use strict'

const mongoose = require('mongoose'),
    user = require('user')

let Schema = mongoose.Schema

// define project Schema
let ProjectSchema = Schema({
    name: String,
    description: String,
    iframe: String,
    owner: user._id,
    url: {
        type: String,
        index: {
            unique: true
        }
    }
})

module.exports = mongoose.model('Project', ProjectSchema)