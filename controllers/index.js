const router = require('express').Router()

const homeRoutes = require('./home');
const authRoutes = require('./auth');
const relationshipRoutes = require('./relationships');

router.use('/auth', authRoutes);
router.use('/', homeRoutes);
router.use('/relationships', relationshipRoutes);



module.exports = router;