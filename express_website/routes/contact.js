/**
 * Created by oguzhan on 04.07.2015.
 */
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('contact', {title: 'Contact'});
});

router.post('/send', function (req, res, next) {
    // create Reusable Transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'oguzhan.karacullu@biznet.com.tr',
            pass: 'effsane14.!.'
        }

    });
    // Email Setup
    var mainOptions = {

        from: 'Oguzhan Karacullu <oguzhan.karacullu@biznet.com.tr>',
        to: 'oguzhan.karacullu@gmail.com',
        subject: 'Website Submission',
        // Plain Text Version
        text: 'You have a new submission with the following details..Name: ' + req.body.name +
        ' Email: ' + req.body.email + ' Message: ' + req.body.message,
        // HTML Version
        html: '<p> You got new submission with the following details ..</p><ul><li>Name: <b>' + req.body.name +
        '</b></li><li>Email: <b>' + req.body.email + '</b></li><li>Message: <b>' + req.body.message + '</b></li></ul>'
    };
    // Send
    transporter.sendMail(mainOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log('Message Sent: ' + info.response);
            res.redirect('/');
        }
    });
});

module.exports = router;
