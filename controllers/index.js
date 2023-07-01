const router = require('express').Router()

const homeRoutes = require('./home');
const authRoutes = require('./auth');

//router.use('/', homeRoutes);
router.use('/auth', authRoutes);

module.exports =router;