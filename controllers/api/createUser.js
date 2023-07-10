const router = require('express').Router();
const session = require('express-session');
const { Op, sequelize } = require('sequelize');
const { getContext, createRelationToLoggedInUser } = require('../../helper/helper');
const { Relationship, User, Side } = require('../../models');
const path = require('path');
const multer = require('multer');
const { picUpload } = require('../../helper/picUpload');



// Create user
router.post('/test', async (req, res) => {
  try {
    const dateOfBirth = req.body.date_of_birth;
    const clickedUser = req.body.user_id;
    const context = await getContext(dateOfBirth, res);
    // call const profilePic = await picUpload(req.body.profile_pic) when working
    const newUser = await User.create({ ...req.body, context });
    await createRelationToLoggedInUser(req, res, newUser, clickedUser);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// Get user data by id

router.get('/api/user/:id', async (req, res) => {
  try {
    const userID = parseInt(req.params.id);

    const clickedUser = await User.findByPk(userID, {
      attributes: ['id', 'sex'],
    });

    if (!clickedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the payload object
    let payload = {
      user_id: userID,
      who_related_id: req.session.userId,
      source_id: req.session.userId,
      side_from_sex: clickedUser.sex,
    };
    res.render('home', { payload });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Upload pic *not working yet
// use this route to test the upload. Add it to main create user route when working
router.post('/upload', picUpload, async (req, res) => {
  try {
    
    res.status(200).json({ success: true, message: 'Image has been uploaded' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

module.exports = router;