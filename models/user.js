'use strict'

const mongoose = require('mongoose')

let Schema = mongoose.Schema

// define user Schema
let UserSchema = Schema({
    username: {
        type: String,
        required: true,
        max: 28,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        max: 50,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true,
        max: 40
    }
}, {
    toObject: {virtuals : true},
    toJSON: {virtuals : true}
})

// UserSchema url field
UserSchema.virtual('url').get(function() {
    return  '/user_profile/' + this.email
})

module.exports = mongoose.model('User', UserSchema)