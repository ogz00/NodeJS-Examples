var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var logger = require('morgan');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
    res.render('register', {
        title: 'Register'
    });
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

//Login
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: 'Invalid username or password'
    }),

    function (req, res) {
        console.log('Authentication Successful');
        req.flash('success', 'You are logged in');
        res.redirect('/');
    });


router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success','You have logged out');
    res.redirect('/users/login');
});

// passport config
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                console.log('Unknown User: ' + username);
                return done(null, false, {message: 'Unknown user'});
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err)throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('Invalid Password attend');
                    return done(null, false, {message: 'Invalid Password'});
                }
            });


        });

    }
));

//Register
router.post('/register', function (req, res, next) {
    //Get Form Values
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;


    //Check for image Field
    if (req.files.profileimage) {
        conosle.log('Uploading file..');

        //File info
        var profileImageOriginalName = req.files.profileimage.originalname;
        var profileImageName = req.files.profileimage.name;
        var profileImageMime = req.files.profileimage.mimetype;
        var profileImagePath = req.files.profileimage.path;
        var profileImageExt = req.files.profileimage.extension;
        var profileImageSize = req.files.profileimage.size;
    } else {
        //Set a default image
        var profileImageName = 'noimage.png';
    }

    //Form Validation
    req.checkBody('name', 'Name cannot be blank').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('email', 'Email cannot be blank').notEmpty();
    req.checkBody('username', 'Username cannot be blank').notEmpty();
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    //Check for errors
    var errors = req.validationErrors();
    if (errors) {
        console.warn('name error: ' + name);
        res.render('register', {
            title: 'Register',
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2

        });
    } else {
        console.warn('name: ' + name);

        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileImageName
        });

        //Create User
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });

        //Success Message
        req.flash('success', 'You are now registered and may log in');

        res.location('/');
        res.redirect('/');
    }


})
;

module.exports = router;

