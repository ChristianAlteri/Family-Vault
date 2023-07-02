const router = require('express').Router();
const session = require('express-session');
const { Op, sequelize } = require('sequelize');
const { createNode } = require('../helper/helper');
const { Relationship, User, Side } = require('../models');

// ----------------------------------------- Display tree
router.get('/', async (req, res) => {
  try {
    // Find all relationships where User.id = Relationship.who_related_to
    // store logged in user, the point of view, into a variable called userId
    const userId = req.session.userId;
    const relatedRelationships = await Relationship.findAll({
      where: {
        [Op.or]: [
          {
            user_id: userId, // People who added the current user
          },
          {
            who_related_id: userId, // People who the current user added
          },
        ],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'biography',
            'profile_pic',
          ],
        },
        {
          model: User,
          as: 'relatedUser',
          attributes: [
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'biography',
            'profile_pic',
          ],
        },
      ],
    });

    let userDataArray = [];
    // related user array is everyone who the logged in user is related ro
    let relatedUserArray = [];
    // let age = []

    for (const relationship of relatedRelationships) {
      const userData = relationship.user.toJSON();
      const relatedUser = relationship.relatedUser.toJSON();
      userDataArray.push(userData);
      relatedUserArray.push(relatedUser);
      // console.log('User:', userData);
      console.log('Related User:', relatedUser);
    }

    //  TODO: before passing in related user run it through a helper function that sorts the data and stores the people in their generation. Something we can build tree from
    res.render('display_tree', {
      userData: userDataArray,
      relatedUser: relatedUserArray,
    });


  } catch (error) {
    console.error('Error fetching user table data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------------------- Login

router.get('/login', (req, res) => {
  res.render('login_test', {});
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the user by email
    const user = await User.findOne({ where: { email } });

    // see if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // see if the pw is correct
    // const passwordMatch = user.checkPassword(password);
    // if (!passwordMatch) {
    //     return res.status(401).json({ message: 'Invalid password' });
    // }

    // Store the user's id in the session
    req.session.userId = user.id;
    // req.session.userGen = user.generation;

    // Save the session to send the session cookie to the client
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ----------------------------------------- Create user

// post route using the createNode function
router.post('/test', createNode);

// ----------------------------------------- Get user data by id

router.get('/api/user/:id', async (req, res) => {
  // We need to figure out how to make the :id the id number of the person we click on.
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

    console.log(payload); // This is the data we get when the plus is clicked on the card
    res.render('home', { payload });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
