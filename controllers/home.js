const router = require('express').Router();
const session = require('express-session');
const { Op, sequelize } = require('sequelize');
const { createNode } = require('../helper/helper');
const { Relationship, User, Side } = require('../models');
const _ = require('lodash')



function getRel(gen, userId ){
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
    // Find all relationships where User.id = Relationship.who_related_to
    // store logged in user, the point of view, into a variable called userId
    // TODO: use group by in the future -- more efficient
    const userId = req.session.userId;


    const grandparentsRel = await getRel(-2, userId);

    const grandParentsRelGrouped = _.groupBy(grandparentsRel, (rel) => rel.side_id);
 
    const grandParentsMum = grandParentsRelGrouped["2"].map((rel) => rel.relatedUser);
    console.log('gp mum', grandParentsMum);
    const grandParentsDad = grandParentsRelGrouped["1"].map((rel) => rel.relatedUser);
    console.log('gp dad', grandParentsDad);

    const parentsRel = await getRel(-1, userId);
    const parentsRelGrouped = _.groupBy(parentsRel, (rel) => rel.side_id);

    const mum = parentsRelGrouped[1].map((rel) => rel.relatedUser);
    const dad = parentsRelGrouped[2].map((rel) => rel.relatedUser);
    const parents = [...mum, ...dad]
    console.log(parents);
    // mum.push(...parents)
    // dad.push(...parents)
    
    // for (let index = 0; index < 3; index++) {
    //   parents.push(parentsRelGrouped[index])
    //   // console.log('parents', parentsRelGrouped[index]);
    // }
    // const mum = parentsRelGrouped["2"].map((rel) => rel.relatedUser);
    // console.log('mum', grandParentsMum);
    // const dad = parentsRelGrouped["1"].map((rel) => rel.relatedUser);
    // console.log('dad', grandParentsDad);


    // const grandParentsDad, grandParentsMum, parents;

    // const famTree = [
    //   [
    //     [...grandParentsMum],
    //     [...grandParentsDad],
    //   ],
    //   [
    //     [...parents]
    //   ],
    //   [
    //     [snooki]
    //   ]

    // ]









    let userDataArray = [];
    // related user array is everyone who the logged in user is related ro
    let relatedUserArray = [];
    // let age = []

    for (const relationship of grandparentsRel) {
      const userData = relationship.user.toJSON();
      const relatedUser = relationship.relatedUser.toJSON();
      userDataArray.push(userData);
      relatedUserArray.push(relatedUser);
      // console.log('User:', userData);
      // console.log('Related User:', relatedUser);
    }

    //  TODO: before passing in related user run it through a helper function that sorts the data and stores the people in their generation. Something we can build tree from
    res.render('display_tree', {
      userData: userDataArray,
      relatedUser: relatedUserArray,
      // grandParentsDad, grandParentsMum, parents,
      //  self
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
  


    // Save the session to send the session cookie to the client
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
    res.redirect('/')
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;