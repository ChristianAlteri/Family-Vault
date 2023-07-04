const router = require('express').Router();
const baseRoutes = require('./home');
const apiRoutes = require('./api/createUser');
const apiCard = require('./api/displayCard');

router.use('/', baseRoutes);
router.use('/', apiRoutes);
router.use('/', apiCard);


module.exports = router;