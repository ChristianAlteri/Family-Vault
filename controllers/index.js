const router = require('express').Router();
const baseRoutes = require('./home');
const apiRoutes = require('./api/createUser');

router.use('/', baseRoutes);
router.use('/', apiRoutes);

module.exports = router;