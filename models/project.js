<<<<<<< HEAD
'use strict'

let mongoose = require('mongoose'),
    User = require('./user')

let Schema = mongoose.Schema

// define project Schema
let ProjectSchema = Schema({
    name: String,
    description: String,
    iframe: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        max: 1
    }
})

// ProjectSchema url field
ProjectSchema.virtual('url').get(function() {
    return  ('/project/' + this.name).replace(/\s+/g, '-')
})

=======
'use strict'

let mongoose = require('mongoose'),
    User = require('./user')

let Schema = mongoose.Schema

// define project Schema
let ProjectSchema = Schema({
    name: String,
    description: String,
    iframe: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        max: 1
    }
})

// ProjectSchema url field
ProjectSchema.virtual('url').get(function() {
    return  ('/project/' + this.name).replace(/\s+/g, '-')
})

>>>>>>> 49c8affb7f20bd6c43e758b2db802fcaa019f9cc
module.exports = mongoose.model('Project', ProjectSchema)