const router = require('express').Router();
const session = require('express-session');


// created signup route for styling! I hope this doesn't conflict

// add further logic below


router.get('/signup', (req, res) => {
    res.render('signup', {})
});

module.exports = router