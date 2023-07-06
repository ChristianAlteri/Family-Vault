const router = require('express').Router();
const session = require('express-session');
const { Op, sequelize } = require('sequelize');
const { createNode } = require('../helper/helper');
const { Relationship, User, Side } = require('../models');
const _ = require('lodash');

function getRel(gen, userId) {
  // const userId = req.session.userId;
  return Relationship.findAll({
    where: {
      generation: gen,
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
}
// ----------------------------------------- Display tree
router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (userId) { // check if user is logged in
    //------------------------------------------------- Get data
    // GrandParents
    const grandparentsRel = await getRel(-2, userId);
    const grandParentsRelGrouped = _.groupBy(
      grandparentsRel,
      (rel) => rel.side_id
    );
    // Parents
    const parentsRel = await getRel(-1, userId);
    const parentsRelGrouped = _.groupBy(parentsRel, (rel) => rel.side_id);
    // Self
    const selfRel = await getRel(0, userId);

    //------------------------------------------------- initialise array
    const grandParentsMumArray = [];
    const grandParentsDadArray = [];
    const mumArray = [];
    const dadArray = [];
    const selfArray = [];

    //------------------------------------------------- Loop and store data
    if (
      grandParentsRelGrouped['2'] === undefined ||
      grandParentsRelGrouped['2'].length === 0
    ) {
    } else {
      // Continue with the for loop
      for (const relationship of grandParentsRelGrouped['2']) {
        const grandParentsMum = relationship.relatedUser.toJSON();
        grandParentsMumArray.push(grandParentsMum);
      }
    }

    if (
      grandParentsRelGrouped['1'] === undefined ||
      grandParentsRelGrouped['1'].length === 0
    ) {
    } else {
      for (const relationship of grandParentsRelGrouped['1']) {
        const grandParentsDad = relationship.relatedUser.toJSON();
        grandParentsDadArray.push(grandParentsDad);
      }
    }

    if (
      parentsRelGrouped[2] === undefined ||
      parentsRelGrouped[2].length === 0
    ) {
    } else {
      for (const relationship of parentsRelGrouped[2]) {
        const parentsMum = relationship.relatedUser.toJSON();
        mumArray.push(parentsMum);
      }
    }
    if (
      parentsRelGrouped[1] === undefined ||
      parentsRelGrouped[1].length === 0
    ) {
    } else {
      for (const relationship of parentsRelGrouped[1]) {
        const parentsDad = relationship.relatedUser.toJSON();
        dadArray.push(parentsDad);
      }
    }
    if (selfRel === undefined || selfRel.length === 0) {
    } else {
      for (const relationship of selfRel) {
        const self = relationship.relatedUser.toJSON();
        selfArray.push(self);
      }
    }

    console.log(
      'grandParentsDadArray',
      grandParentsDadArray,
      'grandParentsMumArray',
      grandParentsMumArray,
      'dadArray:',
      dadArray,
      'mumArray:',
      mumArray,
      'selfArray',
      selfArray
    );
    res.render('display_tree', {
      grandParentsDadArray,
      grandParentsMumArray,
      mumArray,
      dadArray,
      selfArray,
    }); 
    } else {
      res.redirect('/login'); // For example, render a login page
    } 
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

    // Save the session to send the session cookie to the client
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
