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
    console.log(userData);
    const payload = {
      who_related_id: userData.dataValues.id,
      generation: 0,
      source_id: userData.dataValues.id,
      side_id: 2,
      user_id: userData.dataValues.id
    };
    const relData = await Relationship.create(payload, req.body);

    req.session.save(() => {
      req.session.user_id = userData.dataValues.id;
      req.session.logged_in = true;
    });
    res.redirect('/')
  } catch (err) {
    res.render('signup', {
      error: 'Something went wrong',
    });
    console.log(err);
  }
});

module.exports = router;
