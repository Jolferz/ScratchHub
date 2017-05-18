
let mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
	Project = require('./project'),
	comments = require('./comment')


let Schema = mongoose.Schema


// User Schema
let UserSchema = Schema({
	name: String,
	email: {
		type: String,
        required: true,
        max: 50,
        index: {
            unique: true
        }
	},
	username: {
		type: String,
        required: true,
        max: 28,
        index: {
            unique: true
        }
	},
	password: {
		type: String,
        required: true,
        max: 40
	},
	aboutMe: {
		type: String
	},
	interests: {
		type: String
	},
	projects: [{ 
		type: Schema.Types.ObjectId,
		ref: 'Project'
	 }],
	 comments: [{
		 type: Schema.Types.ObjectId,
		 ref: 'comments'
	 }]
}, {
    toObject: {virtuals : true},
    toJSON: {virtuals : true}
})

let User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash
	        newUser.save(callback)
	    })
	})
}

module.exports.getUserByUsername = function(username, callback){
	let query = {username: username}
	User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err
    	callback(null, isMatch)
	})
}
