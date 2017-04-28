// 'use strict'

// let Project = require('../models/project'),
//     User = require('../models/user')


// exports.user_profile_page = (req, res) => {

//     User.findOne({username: req.params.user})
//     .exec(function(err, user) {
//         if (err) throw err
//         console.log(user)
//         res.render('../views/profile', {
//             user: user.username,
//             project: user.project,
//             title: 'ScratchHub'
//         });
//     })

// }