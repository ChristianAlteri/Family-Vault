const router = require('express').Router();
const session = require('express-session');
const { Op, sequelize } = require('sequelize');
const { createNode } = require('../../helper/helper');
const { Relationship, User, Side } = require('../../models');

router.get('/api/user/card/:id', async (req, res) => {
    const userId = parseInt(req.params.id); // Parse the user id from the request URL and convert it to an integer
    try {
      // Assuming relationships is defined and contains necessary data
      const users = await User.findAll({
        where: {
          id: userId,
        },
      });
  
      const userDataArray = users.map((user) => user.toJSON());
  console.log(userDataArray);
      res.render('display_card', { userDataArray });
    } catch (error) {
      console.error('Error fetching user table data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  

  
  
  

  module.exports = router