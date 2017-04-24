'strict mode'

// ==================================== //
//             database test            //
// ==================================== //

let mongoose = require('mongoose'),
    User = require('./models/user'),
    Project = require('./models/project'),
    _Comment = require('./models/comment'),
    express = require('express')

// resolves deprecation warning 'Mongoose: mpromise'
mongoose.Promise = require('bluebird')

let testdb = express()

// ========== Creating Users ============ //

// user1
let user1 = new User({
    username: 'artiphex',
    email: 'jlora018@gmail.com',
    password: 'pass123'
})

// save user1 to the database
user1.save(function(err) {
    if (err) return err
    console.log('user1 saved into the database.')
})

// user2
let user2 = new User({
    username: 'makiavelik',
    email: 'julio_gonzalez@gmail.com',
    password: 'tmmcolon'
})

// save user2 to the database
user2.save(function(err) {
    if (err) return err
    console.log('user2 saved into the database.')
})


// ========== Creating Projects ============ //

// project1
let project1 = new Project({
    name: 'Scratch & Dodge',
    description: 'Play as Scratch while you avoid Dodge and friends. Use the arrow keys up and down to avoid being hit.',
    iframe: '<iframe src="URL"></iframe>',
    owner: user1._id
})

// save project1 to the database
project1.save(function(err) {
    if (err) return err
    console.log('project1 saved into the database.')
})

Project.findOne({name: 'Scratch & Dodge'}).populate('owner').exec(function(err, project) {
    if (err) return err
    // console.log('The owner of this project is: %s', project.owner.username)
})

// project2
let project2 = new Project({
    name: 'My little Piggy',
    description: 'Pigs & Moar!',
    iframe: '<iframe src="URL"></iframe>',
    owner: user1._id
})

// save project2 to the database
project2.save(function(err) {
    if (err) return err
    console.log('project2 saved into the database.')
})

Project.findOne({name: 'Scratch & Dodge'}).populate('owner').exec(function(err, project) {
    if (err) return err
    // console.log('The owner of this project is: %s', project.owner.username)
})

// ========== Creating Comments ============ //

// need to revise this code <-------------------------------------
// comment1
let comment1 = new _Comment({
    commenter: user1._id,
    comment: 'that is such a cool project!',
    project: project1._id
})

comment1.save(function(err) {
    if (err) return err
    console.log('user1 just left a comment!')
})

console.log(project1.url)
console.log(project2.url)
console.log(comment1.post_date)

module.exports = testdb