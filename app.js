'use strict'

let express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    Project = require('./models/project')

let index = require('./routes/index'),
    users = require('./routes/users')

let app = express()

// gets rid of the db deprecation warning 'Mongoose: mpromise'
mongoose.Promise = require('bluebird')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// point specific URL requests to their route handlers
app.use('/', index)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// database connection
let mongoDB = 'mongodb://127.0.0.1/my_database'
mongoose.connect(mongoDB)

// default connection
let db = mongoose.connection

// connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// confirm connection to the database
db.once('open', function() {console.log('We are connected to the database!')})


// ==================================== //
//             database test            //
// ==================================== //

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

// project1
let project1 = new Project({
    name: 'Scratch & Dodge',
    description: 'Play as Scratch while you avoid Dodge and friends. Use the arrow keys up and down to avoid being hit.',
    iframe: '<iframe src="URL"></iframe>',
    owner: user1._id
})

project1.save(function(err) {
    if (err) return err
    console.log('project1 saved into the database.')
})

Project.findOne({name: 'Scratch & Dodge'}).populate('owner').exec(function(err, project) {
    if (err) return handleError(err)
    console.log('The owner of this project is: %s', project.owner.username)
})

// ==================================== //
//        end of database test          //
// ==================================== //


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})



module.exports = app