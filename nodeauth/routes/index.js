var express = require('express');
var router = express.Router();

/* GET Members Page page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
    res.render('index', {title: 'Members Area'});
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');

}

module.exports = router;
