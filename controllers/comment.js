'use strict'

let express = require('require'),
    _Comment = require('../models/comment')

// new comment
exports.new_comment_post = (req, res, next) => {
    res.send('NOT IMPLEMENTED: new comment post')
}

// delete comment
exports.delete_comment = (req, res, next) => {
    // can only delete own comments, need to validate user
    res.send('NOT IMPLEMENTED: delete comment')
}

