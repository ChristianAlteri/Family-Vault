const router = require('express').Router();
const session = require('express-session');
const { Relationship, User } = require('../models');

// created signup route for styling! I hope this doesn't conflict

// add further logic below

router.get('/signup', (req, res) => {
  res.render('signup', {});
});

router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    const payload = {
      who_related_id: 1,
      generation: 0,
      source_id: 1,
      side_id: 2,
    };
    const relData = await Relationship.create(payload, req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
    });
    res.redirect('/dashboard');
  } catch (err) {
    res.render('signup', {
      error: 'Something went wrong',
    });
  }
});

module.exports = router;
