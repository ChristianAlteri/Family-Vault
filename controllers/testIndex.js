const router = require('express').Router();
const testRoutes = require('./chrisTest');

router.use('/', testRoutes);

module.exports = router;