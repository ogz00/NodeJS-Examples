/**
 * Created by oguzhan on 05.07.2015.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/nodeauth');
var db = mongoose.connection;

// User Schema
var UserSchema = Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String, required: true, bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }

});

var User = module.exports = mongoose.model('User', UserSchema);

//mongoose.exports = User;

module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err)throw err;
        //Set hashed password
        newUser.password = hash;
        //create user
        newUser.save(callback);
    });


}