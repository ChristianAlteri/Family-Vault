const router = require('express').Router();
const baseRoutes = require('./home');
const apiRoutes = require('./api/createUser');
const apiCard = require('./api/displayCard');
const signupForm = require('./signup')

router.use('/', baseRoutes);
router.use('/', apiRoutes);
router.use('/', apiCard);
router.use('/', signupForm);


module.exports = router;